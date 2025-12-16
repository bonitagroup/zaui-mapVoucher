// StepBusinessPlan.tsx
import { registerStoreFormState } from "@/state";
import { useAtom } from "jotai";
import {
    IoPeopleOutline,
    IoTimeOutline,
    IoTicketOutline,
    IoPersonCircleOutline,
    IoWalletOutline,
    IoFlagOutline,
} from "react-icons/io5";

export default function Step2() {
    const [form, setForm] = useAtom(registerStoreFormState);

    const update = (k: string, v: any) =>
        setForm((p) => ({ ...p, [k]: v }));

    const toggleVoucher = (v: string) => {
        setForm((p) => ({
            ...p,
            voucherTypes: p.voucherTypes.includes(v)
                ? p.voucherTypes.filter((x) => x !== v)
                : [...p.voucherTypes, v],
        }));
    };

    return (
        <div className="space-y-6">
            {/* Quy mô & Thời gian */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
                <h4 className="text-red-600 font-bold">
                    Quy mô & Thời gian hoạt động
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">
                            Quy mô doanh nghiệp
                        </label>
                        <div className="relative">
                            <IoPeopleOutline
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                className="w-full rounded-xl border border-gray-300 px-11 py-3
                                           focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                                value={form.businessScale}
                                onChange={(e) =>
                                    update("businessScale", e.target.value)
                                }
                                placeholder="VD: 10–50 nhân sự"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">
                            Thời gian hoạt động
                        </label>
                        <div className="relative">
                            <IoTimeOutline
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                className="w-full rounded-xl border border-gray-300 px-11 py-3
                                           focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                                value={form.yearsOperation}
                                onChange={(e) =>
                                    update("yearsOperation", e.target.value)
                                }
                                placeholder="VD: 3 năm"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Voucher */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
                <h4 className="text-red-600 font-bold flex items-center gap-2">
                    <IoTicketOutline />
                    Chương trình voucher
                </h4>

                <div className="flex flex-wrap gap-3">
                    {["Giảm giá", "Combo", "Hoàn tiền"].map((v) => {
                        const active = form.voucherTypes.includes(v);
                        return (
                            <button
                                key={v}
                                type="button"
                                onClick={() => toggleVoucher(v)}
                                className={[
                                    "px-4 py-2 rounded-full border text-sm font-medium transition",
                                    active
                                        ? "bg-red-600 text-white border-red-600"
                                        : "border-gray-300 text-gray-600 hover:border-red-400",
                                ].join(" ")}
                            >
                                {v}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Mục tiêu & Ngân sách */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
                <h4 className="text-red-600 font-bold">
                    Mục tiêu & Ngân sách
                </h4>

                <div>
                    <label className="text-sm font-semibold text-gray-700">
                        Khách hàng mục tiêu
                    </label>
                    <div className="relative">
                        <IoPersonCircleOutline
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            className="w-full rounded-xl border border-gray-300 px-11 py-3
                                       focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                            value={form.targetCustomers}
                            onChange={(e) =>
                                update("targetCustomers", e.target.value)
                            }
                            placeholder="Sinh viên, gia đình, dân văn phòng..."
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-700">
                        Ngân sách hàng tháng
                    </label>
                    <div className="relative">
                        <IoWalletOutline
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            className="w-full rounded-xl border border-gray-300 px-11 py-3
                                       focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                            value={form.monthlyBudget}
                            onChange={(e) =>
                                update("monthlyBudget", e.target.value)
                            }
                            placeholder="VD: 5.000.000 VNĐ"
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-700">
                        Mục tiêu chương trình
                    </label>
                    <div className="relative">
                        <IoFlagOutline
                            className="absolute left-3 top-4 text-gray-400"
                            size={20}
                        />
                        <textarea
                            rows={3}
                            className="w-full rounded-xl border border-gray-300 px-11 py-3
                                       focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                            value={form.campaignGoal}
                            onChange={(e) =>
                                update("campaignGoal", e.target.value)
                            }
                            placeholder="Tăng lượng khách, giữ chân khách cũ..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
