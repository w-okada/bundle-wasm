import * as React from "react";
import { CustomOpenCV } from "opencv-lib";

const App = () => {
    const opencvLib = React.useMemo(() => {
        const lib = new CustomOpenCV();
        lib.init(false);
        return lib;
    }, []);

    React.useEffect(() => {
        console.log("[Pipeline] Start");
        let renderRequestId: number;

        const render = async () => {
            const src = document.getElementById("input") as HTMLImageElement;
            const dst = document.getElementById("output") as HTMLCanvasElement;
            const tmp = document.getElementById("tmp") as HTMLCanvasElement;

            if (src.width > 0 && src.height > 0) {
                [tmp, dst].forEach((x) => {
                    if (x.width !== src.width || x.height !== src.height) {
                        x.width = src.width;
                        x.height = src.height;
                    }

                    const tmpCtx = tmp.getContext("2d")!;
                    tmpCtx.drawImage(src, 0, 0, tmp.width, tmp.height);
                    opencvLib.predict(tmp, 60, 60, 3, false).then((x) => {
                        if (x) {
                            const dstCtx = dst.getContext("2d")!;
                            dstCtx.putImageData(x, 0, 0);
                        }
                    });
                });
            }
            renderRequestId = requestAnimationFrame(render);
        };

        render();
        return () => {
            cancelAnimationFrame(renderRequestId);
        };
    }, []);

    return (
        <div style={{ display: "flex" }}>
            <img alt="input_img" id="input" src="./yuka_kawamura.jpg"></img>
            <canvas id="output"></canvas>
            <canvas id="tmp" hidden></canvas>
        </div>
    );
};
export default App;
