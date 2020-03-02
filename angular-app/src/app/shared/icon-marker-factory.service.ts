import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconMarkerFactoryService {

  constructor() {
  }

  createRiderIcon(clickable: boolean) {
    const riderIcon = document.createElement('mat-icon');
    riderIcon.classList.add('material-icons');
    riderIcon.setAttribute('aria-hidden', 'true');
    riderIcon.innerHTML = 'accessibility';
    riderIcon.setAttribute('id', 'riderIcon');
    if (clickable) {
      riderIcon.addEventListener('mouseover', function (event) {
        riderIcon.classList.add('rider-hover')
      });
      riderIcon.addEventListener('mouseleave', function (event) {
        riderIcon.classList.remove('rider-hover')
      })
    }
    return riderIcon;
  }

  createDriverIcon() {
    const driverIcon = document.createElement('mat-icon');
    driverIcon.setAttribute('id', 'driverIcon')
    driverIcon.classList.add('material-icons');
    driverIcon.setAttribute('aria-hidden', 'true');
    driverIcon.innerHTML = 'motorcycle';
    return driverIcon;
  }
}
