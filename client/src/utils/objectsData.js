const CR = 15;

export const WALLS = (width, height) => {
    const W = 20;
    const marginBottom = 100;
    const cS = "#000";
    const cE = "#777";

    return [
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [W, 0],
                [width - W, 0],
                [width - W, W],
                [W, W],
            ],
            grad: { x1: "0.5", y1: "0", x2: "0.5", y2: "1" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [W, height - marginBottom - W],
                [width - W, height - marginBottom - W],
                [width - W, height - marginBottom],
                [W, height - marginBottom],
            ],
            grad: { x1: "0.5", y1: "1", x2: "0.5", y2: "0" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [0, W],
                [W, W],
                [W, height - marginBottom - W],
                [0, height - marginBottom - W],
            ],
            grad: { x1: "0", y1: "0.5", x2: "1", y2: "0.5" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [width - W, W],
                [width, W],
                [width, height - marginBottom - W],
                [width - W, height - marginBottom - W],
            ],
            grad: { x1: "1", y1: "0.5", x2: "0", y2: "0.5" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [0, 0],
                [W, 0],
                [W, W],
                [0, W],
            ],
            grad: { x1: "0.5", y1: "0.5", x2: "1", y2: "1" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [width - W, 0],
                [width, 0],
                [width, W],
                [width - W, W],
            ],
            grad: { x1: "0.5", y1: "0.5", x2: "0", y2: "1" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [0, height - marginBottom - W],
                [W, height - marginBottom - W],
                [W, height - marginBottom],
                [0, height - marginBottom],
            ],
            grad: { x1: "0.5", y1: "0.5", x2: "1", y2: "0" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [width - W, height - marginBottom - W],
                [width, height - marginBottom - W],
                [width, height - marginBottom],
                [width - W, height - marginBottom],
            ],
            grad: { x1: "0.5", y1: "0.5", x2: "0", y2: "0" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
    ];
};

export const BALL = (x, y) => {
    return {
        type: "ball",
        renderType: "circle",
        position: [x, y],
        radius: CR,
        isBuiltin: false,
        colors: { start: "#ff9999", mid: "#ff0000", end: "#660000" },
        offsets: { start: "0%", mid: "40%", end: "100%" },
        grad: {
            cx: "35%",
            cy: "35%",
            rx: "50%",
            ry: "50%",
            fx: "35%",
            fy: "35%",
        },
    };
};

export const GOAL = (x, y) => {
    return {
        type: "goal",
        renderType: "circle",
        position: [x, y],
        radius: CR,
        isBuiltin: false,
        colors: { start: "#000000", mid: "#2b0054", end: "#9d00ff" },
        offsets: { start: "0%", mid: "70%", end: "100%" },
        grad: {
            cx: "50%",
            cy: "50%",
            rx: "50%",
            ry: "50%",
            fx: "50%",
            fy: "50%",
        },
    };
};

export const HOLE = (x, y) => {
    return {
        type: "hole",
        renderType: "circle",
        position: [x, y],
        radius: CR,
        isBuiltin: false,
        colors: { start: "#000000", mid: "#232323", end: "#3c3c3c" },
        offsets: { start: "0%", mid: "40%", end: "100%" },
        grad: {
            cx: "35%",
            cy: "35%",
            rx: "50%",
            ry: "50%",
            fx: "35%",
            fy: "35%",
        },
    };
};

export const FAN = (x, y) => {
    return {
        type: "fan",
        renderType: "polygon",
        polygon: [
            [x, y],
            [x + 150, y + 50],
            [x + 130, y + 150],
            [x - 20, y + 100],
        ],
        grad: { x1: "0.5", y1: "0.5", x2: "1", y2: "1" },
        colors: {
            start: "rgba(180, 52, 219, 0.7)",
            end: "rgba(0, 0, 0, 0.1)",
        },
    };
};
