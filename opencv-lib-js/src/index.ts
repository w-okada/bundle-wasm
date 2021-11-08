import { OpenCVConfig, OpenCVOperatipnParams, OpenCVProcessTypes, Wasm, WorkerCommand, WorkerResponse } from "./const";
export { OpenCVConfig, OpenCVOperatipnParams, OpenCVProcessTypes } from "./const";

// @ts-ignore
import opencvWasm from "../resources/custom_opencv.wasm";
// @ts-ignore
import opencvWasmSimd from "../resources/custom_opencv-simd.wasm";

import { BrowserType, getBrowserType } from "./BrowserUtil";

export class CustomOpenCV {
    opencvLoaded = false;
    wasm: Wasm | null = null;
    wasmBase64 = opencvWasm.split(",")[1];
    wasmSimdBase64 = opencvWasmSimd.split(",")[1];

    init = async (useSimd: boolean) => {
        const browserType = getBrowserType();
        if (useSimd && browserType !== BrowserType.SAFARI) {
            const modSimd = require("../resources/custom_opencv-simd.js");
            const b = Buffer.from(this.wasmSimdBase64!, "base64");
            this.wasm = await modSimd({ wasmBinary: b });
        } else {
            const mod = require("../resources/custom_opencv.js");
            const b = Buffer.from(this.wasmBase64!, "base64");
            this.wasm = await mod({ wasmBinary: b });
        }
    };

    predict = async (targetCanvas: HTMLCanvasElement, th1: number, th2: number, apertureSize: number, l2gradient: boolean) => {
        if (!this.wasm) {
            return null;
        }

        const ctx = targetCanvas.getContext("2d")!;
        const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);

        const inputImageBufferOffset = this.wasm._getInputImageBufferOffset();

        this.wasm!.HEAPU8.set(imageData.data, inputImageBufferOffset);

        this.wasm._canny(targetCanvas.width, targetCanvas.height, th1, th2, apertureSize, l2gradient);

        const outputImageBufferOffset = this.wasm!._getOutputImageBufferOffset();
        const converted = new ImageData(new Uint8ClampedArray(this.wasm!.HEAPU8.slice(outputImageBufferOffset, outputImageBufferOffset + targetCanvas.width * targetCanvas.height * 4)), targetCanvas.width, targetCanvas.height);

        return converted;
    };
}
