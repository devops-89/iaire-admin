import { platformControllers } from "./app/api/platformControllers";
platformControllers.getDashboardCount().then(res => console.log(JSON.stringify(res, null, 2))).catch(err => console.error(err));
