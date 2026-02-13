// SPDX-FileCopyrightText: (C) ColdFront Authors
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import './scss/coldfront.scss';
import jQuery from 'jquery';

// Bootstrap 4 requires jQuery to be available globally before it's loaded
Object.assign(window, {
  $: jQuery,
  jQuery,
});

import 'bootstrap';
import 'htmx.org';
import { initDateSelector } from './dateSelector';
import { initSelect2 } from './select2';
import { initForm } from './form';
import { initDataTable } from './dataTable';
import { getCookie, drawGauges } from './util';

/* eslint-disable @typescript-eslint/no-explicit-any */

Object.assign(window, {
  getCookie: function (name: string) {
    getCookie(name);
  },
  drawGauges: function (guage_data: Array<any>) {
    drawGauges(guage_data);
  },
});

function initDocument(): void {
  for (const init of [initDateSelector, initSelect2, initForm, initDataTable]) {
    init();
  }
}
if (document.readyState !== 'loading') {
  initDocument();
} else {
  document.addEventListener('DOMContentLoaded', initDocument);
}
