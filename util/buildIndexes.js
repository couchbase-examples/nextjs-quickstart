import { ensureIndexes } from "./ensureIndexes";

ensureIndexes().then(() => {
  console.log("Finished Building Indexes")
}).catch((e) => {
  console.log("Error Building Indexes, ", e);
})
