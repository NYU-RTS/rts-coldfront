// SPDX-FileCopyrightText: (C) ColdFront Authors
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import './scss/coldfront.scss';
import { Modal } from 'bootstrap';
import 'htmx.org';
import { initDateSelector } from './dateSelector';
import { initSelect2 } from './select2';
import { initForm } from './form';
import { initDataTable } from './dataTable';
import { getCookie, drawGauges } from './util';
import { initBootstrap } from './bs';
import jQuery from 'jquery';

/* eslint-disable @typescript-eslint/no-explicit-any */

Object.assign(window, {
  getCookie: function (name: string) {
    getCookie(name);
  },
  drawGauges: function (guage_data: Array<any>) {
    drawGauges(guage_data);
  },
  $: jQuery,
  jQuery,
  bootstrap: { Modal },
});

function initDocument(): void {
  for (const init of [
    initDateSelector,
    initSelect2,
    initForm,
    initDataTable,
    initBootstrap,
  ]) {
    init();
  }
}
if (document.readyState !== 'loading') {
  initDocument();
} else {
  document.addEventListener('DOMContentLoaded', initDocument);
}
