// StepBusinessPlan.tsx
import { registerStoreFormState } from "@/state";
import { useAtom } from "jotai";

const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 " +
    "focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none";

const labelClass =
    "text-sm font-semibold text-gray-700";

const sectionClass =
    "rounded-2xl border border-gray-200 bg-white p-5 space-y-4";

export default function StepBusinessPlan() {
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
            <div className={sectionClass}>
                <h4 className="text-red-600 font-bold">
                    Quy mô & Thời gian hoạt động
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Quy mô doanh nghiệp</label>
                        <input
                            className={inputClass}
                            value={form.businessScale}
                            onChange={(e) => update("businessScale", e.target.value)}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Thời gian hoạt động</label>
                        <input
                            className={inputClass}
                            value={form.yearsOperation}
                            onChange={(e) => update("yearsOperation", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className={sectionClass}>
                <h4 className="text-red-600 font-bold">
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

            <div className={sectionClass}>
                <h4 className="text-red-600 font-bold">
                    Mục tiêu & Ngân sách
                </h4>

                <div>
                    <label className={labelClass}>Khách hàng mục tiêu</label>
                    <input
                        className={inputClass}
                        value={form.targetCustomers}
                        onChange={(e) => update("targetCustomers", e.target.value)}
                    />
                </div>

                <div>
                    <label className={labelClass}>Ngân sách hàng tháng</label>
                    <input
                        className={inputClass}
                        value={form.monthlyBudget}
                        onChange={(e) => update("monthlyBudget", e.target.value)}
                    />
                </div>

                <div>
                    <label className={labelClass}>Mục tiêu chương trình</label>
                    <textarea
                        className={inputClass}
                        rows={3}
                        value={form.campaignGoal}
                        onChange={(e) => update("campaignGoal", e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
