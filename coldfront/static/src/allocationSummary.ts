// SPDX-FileCopyrightText: (C) ColdFront Authors
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import $ from 'jquery';
import { getCookie } from './util';
import DataTable from 'datatables.net-bs4';

$(document).ready(function () {
  get_allocation_summary();
});

function get_allocation_summary() {
  $.ajax({
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    type: 'GET',
    url: '/allocation-summary',
    success: function (data) {
      $('#allocation-summary').html(data);
      const tableDiv = $('#allocation-summary-table');
      if (tableDiv !== null) {
        new DataTable(tableDiv[0], {
          pageLength: 10,
          orderClasses: false,
          order: [[1, 'desc']],
        });
      }
    },
  });
}
