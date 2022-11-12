/**
 * @description: 订单状态
 */
export enum EOrderStatus {
  WAIT_PAY = 0,
  WAIT_SEND = 1,
  WAIT_CONFIRM = 2,
  FINISH = 3,
  CANCEL = 4,
}
/**
 * @description: 打位类型
 */
export enum EPlaySeatType {
  /**
   * @description: 公告打位
   */
  PUBLIC = 'public',
  /**
   * @description: VIP包房
   */
  VIP = 'vip',
}

/**
 * @description: 打位状态
 */
export enum EPlaySeatStatus {
  UNOCCUPIED = 0,
  OCCUPIED = 1,
}

/**
 * @description: 打位预约状态
 */
export enum EPlaySeatOrderStatus {
  WAIT_CONFIRM = 0,
  CONFIRM = 1,
  CANCEL = 2,
}
