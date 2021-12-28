// importScripts("https://unpkg.com/@babel/standalone@7.13.12/babel.min.js");

addEventListener("message", (evt) => {
  const { code, inputs } = evt.data;
  postMessage({ code, inputs });
  /* const executable = Babel.transform(code, {
    plugins: [exportDefaultToReturn],
  });
  postMessage(execute(executable.code)(...inputs)); */
});
