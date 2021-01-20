import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ControlsComponent } from './components/sidebar/controls/controls.component';
import { FunctionRepresentComponent } from './components/sidebar/function-represent/function-represent.component';
import { AboutComponent } from './components/about/about.component';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        AppComponent,
        SidebarComponent,
        ControlsComponent,
        FunctionRepresentComponent,
        AboutComponent,
        WorkspaceComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatInputModule,
        MatDividerModule,
        MatTooltipModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}