interface ICreateTradesRegistersDTO {
    orderId: string;
    symbol: string;
    side: string;
    quantity: number;
    priceUSD: number;
    timestamp: number;
    moment: string;
}

export { ICreateTradesRegistersDTO }