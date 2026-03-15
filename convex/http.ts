import { httpRouter } from "convex/server";
import { authKit } from "./auth";

const http = httpRouter();

// Register WorkOS webhook routes:
//  POST /workos/webhook  — receives user.created / user.updated / user.deleted events
authKit.registerRoutes(http);

export default http;
