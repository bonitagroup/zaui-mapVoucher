export interface RegisterStoreForm {
    businessName: string;
    taxCode: string;
    lat: number | null;
    lng: number | null;
    businessField: string;
    contactPerson: string;
    position: string;
    phone: string;
    licenseImage?: File | null;
    businessScale: string;
    yearsOperation: string;
    voucherTypes: string[];
    targetCustomers: string;
    monthlyBudget: string;
    campaignGoal: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface News {
    id: number;
    title: string;
    image: string;
    categoryId: number;
    views: number;
    content: string;
}