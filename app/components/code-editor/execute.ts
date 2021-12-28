export function execute(code: string, inputs: any[], opts = { timeout: 2000 }) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("/worker.js");

    const timeout = setTimeout(() => {
      worker.terminate();
      reject("Timed out");
    }, opts.timeout);

    worker.addEventListener("message", (evt) => {
      worker.terminate();
      clearTimeout(timeout);
      resolve(evt.data);
    });

    worker.addEventListener("error", (evt) => {
      worker.terminate();
      clearTimeout(timeout);
      reject(evt.message);
    });

    worker.postMessage({ code, inputs });
  });
}
