import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DriverComponent} from "./driver/driver.component";
import {RiderComponent} from "./rider/rider.component";


const routes: Routes = [
  {path: "driver", component: DriverComponent},
  {path: "rider", component: RiderComponent},
  {path: "", redirectTo: "driver", pathMatch: "full"},
  {path: "**", component: DriverComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
