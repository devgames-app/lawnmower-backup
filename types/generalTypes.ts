export interface IBlockData {
  uid: number;
  block_id: number;
  data_version: number;
  bin_data: string;
  last_save_time: string;
}

export interface IPlayerData {
  uid: number;
  nickname: string;
  level: number;
  exp: number;
  vip_point: number;
  json_data: string;
  bin_data: string;
  extra_bin_data: WithImplicitCoercion<string>;
  data_version: number;
  tag_list: string;
  create_time: string;
  last_save_time: string;
  is_delete: number;
  reserved_1: number;
  reserved_2: number;
  before_login_bin_data: WithImplicitCoercion<string>;
}
