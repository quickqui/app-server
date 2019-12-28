export const env: {
  name: string;
  modelUrl: string;
  extendPath: string;
} = (() => {
  if (process.env.ENV === "dev_local")
    return {
      name: "dev_local",
      modelUrl: "http://localhost:1111",
      extendPath: "../..//searchFeed"
    };
  if (process.env.ENV === "dev_docker")
    return {
      name: "dev_docker",
      modelUrl: "http://model-server:1111",
      extendPath: "/extendDir"
    };
  else throw new Error("unknown environment");
})();
