import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [

  {
    path: 'home',
    loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule),
  },

  {
    path: 'auth',
    redirectTo: '/auth',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/auth',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false })],

  exports: [RouterModule]
})
export class AppRoutingModule { }
