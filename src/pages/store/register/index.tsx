import ContainerLayout from "@/components/container";
import StepperForm, { StepConfig } from "@/components/StepperForm";
import { useAtomValue } from "jotai";
import { toast } from "react-hot-toast";
import StepBusinessInfo from "./step1";
import { registerStoreFormState } from "@/state";
import StepBusinessPlan from "./step2";

export default function Register() {
    const form = useAtomValue(registerStoreFormState);

    const steps: StepConfig[] = [
        {
            key: "info",
            title: "Thông tin doanh nghiệp",
            content: <StepBusinessInfo />,
            canProceed: () =>
                !!form.businessName &&
                !!form.phone &&
                form.lat !== null &&
                form.lng !== null,
        },
        {
            key: "plan",
            title: "Kế hoạch voucher",
            content: <StepBusinessPlan />,
            canProceed: () =>
                form.voucherTypes.length > 0 &&
                !!form.monthlyBudget,
        },
    ];

    return (
        <ContainerLayout title="Đăng ký doanh nghiệp">
            <StepperForm
                steps={steps}
                allowJump="back"
                onFinish={async () => {
                    console.log("SUBMIT:", form);
                    toast.success("Đăng ký thành công!");
                }}
            />
        </ContainerLayout>
    );
}
