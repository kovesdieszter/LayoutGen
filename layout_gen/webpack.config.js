module.exports = {
  // A többi konfiguráció...
  module: {
    rules: [
      // Egyéb szabályok...
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192, // Ha a képfájl kisebb, mint 8kb, akkor adatként átalakítja a képet
              fallback: "file-loader", // Ha a kép mérete meghaladja a limitet, akkor a file-loader-t használja
            },
          },
        ],
      },
    ],
  },
};
