
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { RegisterComponent } from './components/register/register.component';
import { MainLoginComponent } from './components/main-login/main-login.component';
import { VoteComponent } from './components/vote/vote.component';
import { RankComponent } from './components/rank/rank.component';
import { GrapComponent } from './components/grap/grap.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SeeProfileComponent } from './components/see-profile/see-profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminprofileComponent } from './components/adminprofile/adminprofile.component';
import { AdmingrapComponent } from './components/admingrap/admingrap.component';
import { AdmintopComponent } from './components/admintop/admintop.component';
import { ProfilescoreComponent } from './components/profilescore/profilescore.component';
import { AdproscoreComponent } from './components/adproscore/adproscore.component';


export const routes: Routes = [
    {path:"",component:LoginComponent},
    {path: "about", component: AboutComponent},
    {path: "register", component: RegisterComponent},
    {path: "main", component: MainLoginComponent},
    {path: "vote", component: VoteComponent},
    {path: "rank", component: RankComponent},
    {path: "grap/:bid", component: GrapComponent},
    {path: "profile/:uid",component: ProfileComponent},
    {path: "see-profile/:uid_fk/:bid",component: SeeProfileComponent},
    {path: "admin",component: AdminComponent},
    {path: "adminprofile/:uid",component: AdminprofileComponent},
    {path: "admingrap/:bid",component: AdmingrapComponent},
    {path: "admintop",component: AdmintopComponent},
    {path: "profilescore/:uid",component: ProfilescoreComponent},
    {path: "adproscore/:uid",component: AdproscoreComponent}

]
