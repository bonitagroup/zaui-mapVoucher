import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

type MaybePromise<T> = T | Promise<T>;

type StepperCtx = {
    index: number;
    total: number;
    isFirst: boolean;
    isLast: boolean;
    goTo: (i: number) => void;
    next: () => void;
    back: () => void;
    setLoading: (v: boolean) => void;
};

export type StepConfig = {
    key: string;
    title: string;

    indicator?: ReactNode | ((ctx: StepperCtx) => ReactNode);

    content: ReactNode | ((ctx: StepperCtx) => ReactNode);

    primaryText?: string;
    secondaryText?: string;

    canProceed?: boolean | ((ctx: StepperCtx) => boolean);

    onPrimary?: (ctx: StepperCtx) => MaybePromise<void>;
    onSecondary?: (ctx: StepperCtx) => void;
};

type ThemeName = "red" | "blue" | "emerald" | "violet" | "orange" | "slate";

type StepperFormProps = {
    steps: StepConfig[];

    initialIndex?: number;

    activeIndex?: number;
    onActiveIndexChange?: (i: number) => void;

    onFinish?: () => MaybePromise<void>;

    showProgress?: boolean;
    className?: string;

    allowJump?: "back" | "any" | false;

    canJumpTo?: (toIndex: number, ctx: StepperCtx) => boolean;

    requireValidBeforeJump?: boolean;

    theme?: ThemeName;
};

function getTheme(theme: ThemeName) {
    const map: Record<ThemeName, {
        solid: string;
        solidHover: string;
        solidText: string;
        soft: string;
        softText: string;
        ring: string;
    }> = {
        red: {
            solid: "bg-red-600",
            solidHover: "hover:bg-red-700",
            solidText: "text-white",
            soft: "bg-red-100",
            softText: "text-red-700",
            ring: "focus:ring-red-300",
        },
        blue: {
            solid: "bg-blue-600",
            solidHover: "hover:bg-blue-700",
            solidText: "text-white",
            soft: "bg-blue-100",
            softText: "text-blue-700",
            ring: "focus:ring-blue-300",
        },
        emerald: {
            solid: "bg-emerald-600",
            solidHover: "hover:bg-emerald-700",
            solidText: "text-white",
            soft: "bg-emerald-100",
            softText: "text-emerald-700",
            ring: "focus:ring-emerald-300",
        },
        violet: {
            solid: "bg-violet-600",
            solidHover: "hover:bg-violet-700",
            solidText: "text-white",
            soft: "bg-violet-100",
            softText: "text-violet-700",
            ring: "focus:ring-violet-300",
        },
        orange: {
            solid: "bg-orange-600",
            solidHover: "hover:bg-orange-700",
            solidText: "text-white",
            soft: "bg-orange-100",
            softText: "text-orange-700",
            ring: "focus:ring-orange-300",
        },
        slate: {
            solid: "bg-slate-800",
            solidHover: "hover:bg-slate-900",
            solidText: "text-white",
            soft: "bg-slate-100",
            softText: "text-slate-700",
            ring: "focus:ring-slate-300",
        },
    };

    return map[theme];
}

export default function StepperForm({
    steps,
    initialIndex = 0,
    activeIndex,
    onActiveIndexChange,
    onFinish,
    showProgress = true,
    className,
    allowJump = "back",
    canJumpTo,
    requireValidBeforeJump = true,
    theme = "red",
}: StepperFormProps) {
    const t = getTheme(theme);

    const isControlled = typeof activeIndex === "number";
    const [internalIndex, setInternalIndex] = useState(initialIndex);
    const [loading, setLoading] = useState(false);

    const index = isControlled ? (activeIndex as number) : internalIndex;
    const total = steps.length;
    const step = steps[index];

    const [maxReached, setMaxReached] = useState<number>((activeIndex ?? initialIndex) || 0);

    useEffect(() => {
        setMaxReached((prev) => Math.max(prev, index));
    }, [index]);

    const goTo = useCallback((i: number) => {
        const nextIndex = Math.max(0, Math.min(total - 1, i));
        if (isControlled) onActiveIndexChange?.(nextIndex);
        else setInternalIndex(nextIndex);
    }, [isControlled, onActiveIndexChange, total]);

    const next = useCallback(() => goTo(index + 1), [goTo, index]);
    const back = useCallback(() => goTo(index - 1), [goTo, index]);

    const ctx: StepperCtx = useMemo(() => ({
        index,
        total,
        isFirst: index === 0,
        isLast: index === total - 1,
        goTo,
        next,
        back,
        setLoading,
    }), [index, total, goTo, next, back]);

    const ctxFor = useCallback((i: number): StepperCtx => ({
        index: i,
        total,
        isFirst: i === 0,
        isLast: i === total - 1,
        goTo,
        next: () => goTo(i + 1),
        back: () => goTo(i - 1),
        setLoading,
    }), [goTo, setLoading, total]);

    const isStepValid = useCallback((i: number) => {
        const s = steps[i];
        if (!s) return false;

        if (typeof s.canProceed === "function") return s.canProceed(ctxFor(i));
        if (typeof s.canProceed === "boolean") return s.canProceed;
        return true;
    }, [steps, ctxFor]);

    const arePrereqsValid = useCallback((toIndex: number) => {
        if (!requireValidBeforeJump) return true;

        for (let k = 0; k < toIndex; k++) {
            if (!isStepValid(k)) return false;
        }
        return true;
    }, [isStepValid, requireValidBeforeJump]);

    const canProceed = useMemo(() => {
        if (loading) return false;
        if (typeof step.canProceed === "function") return step.canProceed(ctx);
        if (typeof step.canProceed === "boolean") return step.canProceed;
        return true;
    }, [loading, step.canProceed, ctx]);

    const primaryText = step.primaryText ?? (ctx.isLast ? "Hoàn tất" : "Tiếp tục");
    const secondaryText = step.secondaryText ?? "Quay lại";

    const content = useMemo(() => {
        return typeof step.content === "function" ? step.content(ctx) : step.content;
    }, [step.content, ctx]);

    const handlePrimary = useCallback(async () => {
        if (!canProceed || loading) return;

        try {
            setLoading(true);

            if (step.onPrimary) {
                await step.onPrimary(ctx);
                return;
            }

            if (ctx.isLast) {
                await onFinish?.();
                return;
            }

            ctx.next();
        } finally {
            setLoading(false);
        }
    }, [canProceed, loading, step, ctx, onFinish]);

    const handleSecondary = useCallback(() => {
        if (loading) return;

        if (step.onSecondary) {
            step.onSecondary(ctx);
            return;
        }

        if (!ctx.isFirst) ctx.back();
    }, [loading, step, ctx]);

    const handleJump = useCallback((toIndex: number) => {
        if (loading) return;
        if (allowJump === false) return;

        const allowedByMode = allowJump === "any" ? true : toIndex <= maxReached;
        if (!allowedByMode) return;

        if (!arePrereqsValid(toIndex)) return;
        if (canJumpTo && !canJumpTo(toIndex, ctx)) return;

        ctx.goTo(toIndex);
    }, [loading, allowJump, maxReached, arePrereqsValid, canJumpTo, ctx]);

    return (
        <div className={className}>
            {showProgress && (
                <div className="mb-6">
                    <div className="flex items-center justify-between gap-2">
                        {steps.map((s, i) => {
                            const isActive = i === index;
                            const isDone = i < index;

                            const clickable =
                                allowJump !== false &&
                                (allowJump === "any" ? true : i <= maxReached) &&
                                arePrereqsValid(i) &&
                                (!canJumpTo || canJumpTo(i, ctx)) &&
                                !loading;

                            const indicatorNode =
                                typeof s.indicator === "function"
                                    ? s.indicator(ctx)
                                    : (s.indicator ?? (i + 1));

                            return (
                                <button
                                    key={s.key}
                                    type="button"
                                    onClick={() => handleJump(i)}
                                    disabled={!clickable}
                                    className={[
                                        "flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition",
                                        isActive
                                            ? `${t.solid} ${t.solidText}`
                                            : isDone
                                                ? `${t.soft} ${t.softText} hover:opacity-90`
                                                : "bg-gray-100 text-gray-600",
                                        clickable ? "cursor-pointer" : "cursor-not-allowed opacity-60",
                                    ].join(" ")}
                                    title={s.title}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <span
                                            className={[
                                                "inline-flex h-6 min-w-6 px-2 items-center justify-center rounded-full text-xs font-bold",
                                                isActive
                                                    ? "bg-white/20 text-white"
                                                    : isDone
                                                        ? `${t.solid} ${t.solidText}`
                                                        : "bg-gray-300 text-gray-700",
                                            ].join(" ")}
                                        >
                                            {indicatorNode}
                                        </span>

                                        <span className="hidden sm:inline truncate">
                                            {s.title}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="space-y-5">
                {content}

                <div className="flex gap-3 pt-4">
                    {!ctx.isFirst && (
                        <button
                            type="button"
                            onClick={handleSecondary}
                            className="flex-1 border border-gray-300 py-3 rounded-xl"
                            disabled={loading}
                        >
                            {secondaryText}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handlePrimary}
                        disabled={!canProceed || loading}
                        className={[
                            "flex-1 py-3 rounded-xl font-semibold transition",
                            canProceed && !loading
                                ? `${t.solid} ${t.solidHover} ${t.solidText}`
                                : "bg-gray-300 text-gray-500 cursor-not-allowed",
                        ].join(" ")}
                    >
                        {loading ? "Đang xử lý..." : primaryText}
                    </button>
                </div>
            </div>
        </div>
    );
}
