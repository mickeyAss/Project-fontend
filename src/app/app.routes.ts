
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { RegisterComponent } from './components/register/register.component';
import { MainLoginComponent } from './components/main-login/main-login.component';
import { VoteComponent } from './components/vote/vote.component';


export const routes: Routes = [
    {path:"login",component:LoginComponent},
    {path: "about", component: AboutComponent},
    {path: "register", component: RegisterComponent},
    {path: "", component: MainLoginComponent},
    {path: "vote", component: VoteComponent}
]
