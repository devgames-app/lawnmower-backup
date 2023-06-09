import { IBlockData, IPlayerData } from '@/types/generalTypes';
import type { NextApiRequest, NextApiResponse } from 'next';
import moment from 'moment';
import zlib from 'zlib';
import { mysqlAccounts, mysqlUser } from '@/server/database';

type Data = Buffer | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    try {
      const { username } = JSON.parse(req.body);

      const uidQuery = `
        SELECT uid FROM accounts
        WHERE username = ?;
      `;

      const [uidRows] = await mysqlAccounts
        .promise()
        .query(uidQuery, [username]);
      if (uidRows.length === 0) {
        res.status(500).json({ message: 'Username not found' });
      }

      const uid = uidRows[0].uid;

      const query = `
        SELECT uid, nickname, level, exp, vip_point, json_data, bin_data, extra_bin_data, data_version, tag_list, create_time, last_save_time, is_delete, reserved_1, reserved_2, before_login_bin_data, null as block_id
        FROM t_player_data_${uid % 10}
        WHERE uid = ?
        UNION 
        SELECT uid, null as nickname, null as level, null as exp, null as vip_point, null as json_data, bin_data, null as extra_bin_data, data_version, null as tag_list, null as create_time, last_save_time, null as is_delete, null as reserved_1, null as reserved_2, null as before_login_bin_data, block_id
        FROM t_block_data_${uid % 10}
        WHERE uid = ?;
      `;

      const [rows] = await mysqlUser.promise().query(query, [uid, uid]);

      const player_data = rows
        .filter((row: { nickname: string }) => row.nickname)
        .map((row: IPlayerData) => [
          row.uid,
          row.nickname,
          row.level,
          row.exp,
          row.vip_point,
          row.json_data,
          row.bin_data ? Buffer.from(row.bin_data).toString('hex') : null,
          row.extra_bin_data
            ? Buffer.from(row.extra_bin_data).toString('hex')
            : null,
          row.data_version,
          row.tag_list,
          moment(row.create_time).format('YYYY-MM-DD HH:mm:ss'),
          moment(row.last_save_time).format('YYYY-MM-DD HH:mm:ss'),
          row.is_delete,
          row.reserved_1,
          row.reserved_2,
          row.before_login_bin_data
            ? Buffer.from(row.before_login_bin_data).toString('hex')
            : null,
        ]);

      const block_data = rows
        .filter((row: { nickname: string }) => !row.nickname)
        .map((row: IBlockData) => [
          row.uid,
          row.block_id,
          row.data_version,
          row.bin_data ? Buffer.from(row.bin_data).toString('hex') : null,
          moment(row.last_save_time).format('YYYY-MM-DD HH:mm:ss'),
        ]);

      const backup = JSON.stringify({ player_data, block_data });

      zlib.deflate(backup, (err: unknown, buffer: Buffer) => {
        if (err) {
          res.status(500).json({ message: 'Error compressing data' });
        } else {
          res.setHeader('Content-Encoding', 'deflate');
          res.send(buffer);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating backup' });
    }
  }
}
