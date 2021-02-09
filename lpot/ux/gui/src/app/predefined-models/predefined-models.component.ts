import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Md5 } from 'ts-md5';
import { ErrorComponent } from '../error/error.component';
import { FileBrowserComponent } from '../file-browser/file-browser.component';
import { ModelService } from '../services/model.service';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-predefined-models',
  templateUrl: './predefined-models.component.html',
  styleUrls: ['./predefined-models.component.scss', './../error/error.component.scss']
})
export class PredefinedModelsComponent implements OnInit {

  modelList = [];
  showSpinnerModel = [];
  showSpinnerConfig = [];
  showSpinner = true;

  constructor(
    private modelService: ModelService,
    private socketService: SocketService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.listModelZoo();

    this.modelService.workspacePathChange.subscribe(
      response => {
        this.listModelZoo();
      }
    )

    this.socketService.modelDownloadFinish$
      .subscribe(response => {
        if (response['data'] && response['data']['path']) {
          if (response['data']['path'].includes('.yaml')) {
            this.showSpinnerConfig[response['data']['id']] = false;
            this.modelList[response['data']['id']]['yaml'] = response['data']['path'];
          } else {
            this.showSpinnerModel[response['data']['id']] = false;
            this.modelList[response['data']['id']]['model_path'] = response['data']['path'];
          }
        }
      });
  }

  listModelZoo() {
    this.modelService.listModelZoo()
      .subscribe(
        (resp: []) => {
          this.showSpinner = false;
          this.modelList = resp;
        },
        error => {
          this.showSpinner = false;
          this.openErrorDialog(error);
        });
  }

  objectKeys(obj): string[] {
    return Object.keys(obj);
  }

  downloadModel(model, index: number) {
    this.showSpinnerModel[index] = true;
    this.modelService.downloadModel(model, index)
      .subscribe(
        response => { },
        error => {
          this.openErrorDialog(error);
        }
      );
  }

  downloadConfig(model, index: number) {
    this.showSpinnerConfig[index] = true;
    this.modelService.downloadConfig(model, index)
      .subscribe(
        response => { },
        error => {
          this.openErrorDialog(error);
        }
      );
  }

  isModelFilled(model) {
    if (model['yaml'] && model['model_path'] && model['dataset_path']) {
      return true;
    }
    return false;
  }

  openDialog(files: boolean, modelsOnly: boolean, index: number) {
    const dialogRef = this.dialog.open(FileBrowserComponent, {
      width: '60%',
      height: '60%',
      data: {
        path: this.modelService.workspacePath,
        files: files,
        modelsOnly: modelsOnly
      }
    });

    dialogRef.afterClosed().subscribe(chosenFile => {
      if (chosenFile) {
        this.modelList[index]['dataset_path'] = chosenFile;
      }
    });;
  }

  openErrorDialog(error) {
    const dialogRef = this.dialog.open(ErrorComponent, {
      data: error
    });
  }

  saveWorkload(model) {
    let workload = {};
    const id = new Md5();
    const dateTime = Date.now();
    workload['id'] = String(id.appendStr(String(dateTime)).end());
    workload['config_path'] = model['yaml'];
    workload['dataset_path'] = model['dataset_path'];
    workload['model_path'] = model['model_path'];
    workload['framework'] = model['framework'];
    workload['domain'] = model['domain'];
    this.modelService.saveWorkload(workload)
      .subscribe(
        response => {
          model['added'] = true;
        },
        error => {
          this.openErrorDialog(error);
        }
      );
  }

  getFileNameFromPath(path: string): string {
    return path.replace(/^.*[\\\/]/, '');
  }

}
