const nextConfig = {
    webpack: (config, { isServer }) => {
      patchWasmModuleImport(config, isServer);
  
      if (!isServer) {
        config.output.environment = { ...config.output.environment, asyncFunction: true };
      }
      return config;
    },
  };
  
  // Define the function to patch WebAssembly module import
  function patchWasmModuleImport(config, isServer) {
    config.experiments = Object.assign(config.experiments || {}, {
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    });
  
    config.optimization.moduleIds = "named";
  
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });
  
    if (isServer) {
      config.output.webassemblyModuleFilename = "./../static/wasm/tfhe_bg.wasm";
    } else {
      config.output.webassemblyModuleFilename = "static/wasm/tfhe_bg.wasm";
    }
  }
  
  // Export the configuration as default
  export default nextConfig;