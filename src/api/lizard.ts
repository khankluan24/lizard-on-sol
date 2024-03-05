import { axiosInstance } from ".";

export const checkWl = async (address: string): Promise<WhiteList> => {
    const res = await axiosInstance.get("/checkwl", { params: { address } });
    if (!res.data) throw new Error("No data");
    return res.data;
};

export const fetchTotalRise = async (): Promise<WhiteList> => {
    const res = await axiosInstance.get("/totalraise");
    if (!res.data) throw new Error("No data");
    return res.data;
};