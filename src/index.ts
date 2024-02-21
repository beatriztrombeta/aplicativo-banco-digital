import "dotenv/config";
import express from "express";
import usersRoutes from "routes/UserRoute";
import onboardingRoutes from "routes/OnboardingRoute";
import accountRoutes from "routes/AccountRoute"
import transferenceRoutes from "routes/TransferenceRoute"
import { DateTime } from "luxon";


DateTime.local().setZone("America/Sao_Paulo");

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  return res.send("Hello World");
});

app.use("/onboarding", onboardingRoutes);
app.use("/users", usersRoutes);
app.use("/conta", accountRoutes);
app.use("/transferencia", transferenceRoutes);
app.listen(process.env.PORT || 3344);
