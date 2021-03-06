import {Component, OnInit, Renderer2} from '@angular/core';
import {VariablesService} from '../_helpers/services/variables.service';
import {BackendService} from '../_helpers/services/backend.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  theme: string;
  scale: number;
  changeForm: any;
  appLockOptions = [
    {
      id: 5,
      name: 'SETTINGS.APP_LOCK.TIME1'
    },
    {
      id: 15,
      name: 'SETTINGS.APP_LOCK.TIME2'
    },
    {
      id: 60,
      name: 'SETTINGS.APP_LOCK.TIME3'
    },
    {
      id: 0,
      name: 'SETTINGS.APP_LOCK.TIME4'
    }
  ];
  appScaleOptions = [
    {
      id: 7.5,
      name: '75% scale'
    },
    {
      id: 10,
      name: '100% scale'
    },
    {
      id: 12.5,
      name: '125% scale'
    },
    {
      id: 15,
      name: '150% scale'
    }
  ];

  constructor(private renderer: Renderer2, public variablesService: VariablesService, private backend: BackendService, private location: Location) {
    this.theme = this.variablesService.settings.theme;
    this.scale = this.variablesService.settings.scale;
    this.changeForm = new FormGroup({
      password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      new_confirmation: new FormControl('', Validators.required)
    }, [(g: FormGroup) => {
      return g.get('new_password').value === g.get('new_confirmation').value ? null : {'confirm_mismatch': true};
    }, (g: FormGroup) => {
      return g.get('password').value === this.variablesService.appPass ? null : {'pass_mismatch': true};
    }]);
  }

  ngOnInit() {}

  setTheme(theme) {
    this.renderer.removeClass(document.body, 'theme-' + this.theme);
    this.theme = theme;
    this.variablesService.settings.theme = this.theme;
    this.renderer.addClass(document.body, 'theme-' + this.theme);
    this.backend.storeAppData();
  }

  setScale(scale) {
    this.scale = scale;
    this.variablesService.settings.scale = this.scale;
    this.renderer.setStyle(document.documentElement, 'font-size', this.scale + 'px');
    this.backend.storeAppData();
  }

  onSubmitChangePass() {
    if (this.changeForm.valid) {
      this.variablesService.appPass = this.changeForm.get('new_password').value;
      this.backend.storeSecureAppData((status, data) => {
        if (status) {
          this.changeForm.reset();
        } else {
          console.log(data);
        }
      });
    }
  }

  onLockChange() {
    this.variablesService.restartCountdown();
    this.backend.storeAppData();
  }

  back() {
    this.location.back();
  }

}
