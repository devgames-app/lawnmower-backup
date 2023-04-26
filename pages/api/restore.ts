import { NextApiRequest, NextApiResponse } from 'next';
const moment = require('moment');
const { mysqlAccounts, mysqlUser } = require('@/server/database');

type Data = Buffer | { message: string } | string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const { newusername } = req.body;

    const uidQuery = `
      SELECT uid FROM accounts
      WHERE username = ?;
    `;

    const [uidRows] = await mysqlAccounts
      .promise()
      .query(uidQuery, [newusername]);
    if (uidRows.length === 0) {
      res.status(500).json({ message: 'Username not found' });
      return;
    }

    const newid = uidRows[0].uid;
    const backup = req.body;

    mysqlUser.beginTransaction((err: Error) => {
      if (err) {
        console.error('Error starting transaction: ', err);
        res.status(500).json({ message: 'Error starting transaction' });
        return;
      }

      const deletePlayerDataQuery = `DELETE FROM t_player_data_${
        newid % 10
      } WHERE uid = ?;`;
      const deleteBlockDataQuery = `DELETE FROM t_block_data_${
        newid % 10
      } WHERE uid = ?;`;

      mysqlUser.query(deletePlayerDataQuery, [newid], (err: Error) => {
        if (err) {
          console.error(
            'Error deleting old data from t_player_data table: ',
            err
          );
          mysqlUser.rollback();
          res.status(500).json({
            message: 'Error deleting old data from t_player_data table',
          });
          return;
        }

        mysqlUser.query(deleteBlockDataQuery, [newid], (err: Error) => {
          if (err) {
            console.error(
              'Error deleting old data from t_block_data table: ',
              err
            );
            mysqlUser.rollback();
            res.status(500).json({
              message: 'Error deleting old data from t_block_data table',
            });
            return;
          }

          const playerDataValues = backup.player_data.map((row: string[]) => {
            const formattedCreateTime = moment(row[10]).format(
              'YYYY-MM-DD HH:mm:ss'
            );
            const formattedLastSaveTime = moment(row[11]).format(
              'YYYY-MM-DD HH:mm:ss'
            );
            return [
              newid,
              ...row.slice(1, 6),
              row[6] ? Buffer.from(row[6], 'hex') : null,
              row[7] ? Buffer.from(row[7], 'hex') : null,
              row[8],
              row[9],
              formattedCreateTime,
              formattedLastSaveTime,
              ...row.slice(12, 15),
              row[15] ? Buffer.from(row[15], 'hex') : null,
            ];
          });

          const insertPlayerDataQuery = `INSERT INTO t_player_data_${
            newid % 10
          } (uid, nickname, level, exp, vip_point, json_data, bin_data, extra_bin_data, data_version, tag_list, create_time, last_save_time, is_delete, reserved_1, reserved_2, before_login_bin_data) VALUES ?`;

          mysqlUser.query(
            insertPlayerDataQuery,
            [playerDataValues],
            (err: Error) => {
              if (err) {
                console.error(
                  'Error inserting backup data into player_data table: ',
                  err
                );
                mysqlUser.rollback();
                res.status(500).json({
                  message: 'Error inserting backup data into player_data table',
                });
                return;
              }

              const blockDataValues = backup.block_data.map((row: string[]) => [
                newid,
                ...row.slice(1, 3),
                row[3] ? Buffer.from(row[3], 'hex') : null,
                moment(row[4]).format('YYYY-MM-DD HH:mm:ss'),
              ]);

              const insertBlockDataQuery = `INSERT INTO t_block_data_${
                newid % 10
              } (uid, block_id, data_version, bin_data, last_save_time) VALUES ?`;

              mysqlUser.query(
                insertBlockDataQuery,
                [blockDataValues],
                (err: unknown) => {
                  if (err) {
                    console.error(
                      'Error while inserting block_data backup data: ',
                      err
                    );
                    mysqlUser.rollback();
                    res.status(500).json({
                      message: 'Error while inserting block_data backup data:',
                    });
                    return;
                  }

                  mysqlUser.commit((err: Error) => {
                    if (err) {
                      console.error('Error finalizing transaction: ', err);
                      mysqlUser.rollback();
                      res.status(500).send('Error finalizing transaction');
                      return;
                    }
                    res.send(
                      `Backup successfully restored in ${newusername}'s account!`
                    );
                  });
                }
              );
            }
          );
        });
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error restoring backup' });
  }
}
