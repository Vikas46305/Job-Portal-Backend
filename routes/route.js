import express from "express";

import userController from "../controller/user.controller.js";
import companyController from "../controller/company.controller.js";
import jobController from "../controller/job.controller.js";
import applicationController from "../controller/application.controller.js";

const App = express.Router();

App.use("/user", userController);
App.use("/company", companyController);
App.use("/job", jobController);
App.use("/application", applicationController);

export default App;
