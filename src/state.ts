import { atom } from "jotai";
import { RegisterStoreForm } from "./type";

export const registerStoreFormState =
    atom<RegisterStoreForm>({
    businessName: "",
    taxCode: "",
    lat: null,
    lng: null,
    businessField: "",

    contactPerson: "",
    position: "",
    phone: "",
    licenseImage: null,

    businessScale: "",
    yearsOperation: "",

    voucherTypes: [],
    targetCustomers: "",
    monthlyBudget: "",
    campaignGoal: "",
});
