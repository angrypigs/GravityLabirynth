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

export const WALL = (x, y, w, h) => {
    return [
        {
            type: "wall_custom",
            renderType: "polygon",
            position: [x, y],
            verticesOffsets: [
                [-w / 2, -h / 2],
                [w / 2, -h / 2],
                [w / 2, h / 2],
                [-w / 2, h / 2],
            ],
            grad: { x1: "0.3", y1: "0.3", x2: "1", y2: "1" },
            colors: { start: "#000000", end: "#999999" },
            isBuiltin: false,
        },
    ];
};

export const BALL = (x, y) => {
    return [
        {
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
        },
    ];
};

export const GOAL = (x, y) => {
    return [
        {
            type: "goal",
            renderType: "circle",
            position: [x, y],
            radius: CR + 2,
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
        },
    ];
};

export const HOLE = (x, y) => {
    return [
        {
            type: "hole",
            renderType: "circle",
            position: [x, y],
            radius: CR + 2,
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
        },
    ];
};

export const FAN = (x, y) => {
    const offsets = [
        [20, 50],
        [-20, 50],
        [-20, -50],
        [20, -50],
    ];

    const m1X = (offsets[3][0] + offsets[0][0]) / 2;
    const m1Y = (offsets[3][1] + offsets[0][1]) / 2;

    const m2X = (offsets[1][0] + offsets[2][0]) / 2;
    const m2Y = (offsets[1][1] + offsets[2][1]) / 2;

    const xs = offsets.map((p) => p[0]);
    const ys = offsets.map((p) => p[1]);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const w = maxX - minX;
    const h = maxY - minY;

    const x1 = ((m1X - minX) / w).toString();
    const y1 = ((m1Y - minY) / h).toString();
    const x2 = ((m2X - minX) / w).toString();
    const y2 = ((m2Y - minY) / h).toString();

    return [
        {
            type: "fan",
            renderType: "polygon",
            position: [x, y],
            verticesOffsets: offsets,
            grad: { x1, y1, x2, y2 },
            colors: {
                start: "rgba(180, 52, 219, 0.7)",
                end: "rgba(0, 0, 0, 0.1)",
            },
            isBuiltin: false,
        },
    ];
};