

// "user_wallet_address": "0xf384cb884b647c24a5d33e949d993e0502e66a92",
//             "asset_name": "brew",
//             "active_assets": 2,
//             "used_assets": 0,


export interface AssetsInterface {
  "user_wallet_address": string,
  "asset_name": string,
  "active_assets": number,
  "used_assets": number,
}

export interface QueueSingleEntry {
  fight_id: string,

  total_bet_p1: number,
  total_bet_p2: number,

  player1_end_health: number;
  player2_end_health: number;

  win_pot_p1: number,
  win_pot_p2: number,

  player1: string,
  player2: string,

  self_bet_p1: number,
  self_bet_p2: number,

  fight_winner: string,
}