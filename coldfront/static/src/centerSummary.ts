// SPDX-FileCopyrightText: (C) ColdFront Authors
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import $ from 'jquery';
import c3 from 'c3';
import { getCookie } from './util';
import DataTable from 'datatables.net-bs4';

/* eslint-disable @typescript-eslint/no-explicit-any */

$(document).ready(function () {
  new DataTable('#fos-table', {
    pageLength: 10,
    orderClasses: false,
    order: [[1, 'desc']],
  });

  drawPublications();
  drawGrantsByAgency();
  get_allocation_by_fos();
  get_allocation_summary();
});

function drawPublications() {
  const publication_by_year_bar_chart_data: any = JSON.parse(
    document.getElementById('publication-by-year-bar-chart-data')!.textContent!
  );
  if (publication_by_year_bar_chart_data['columns'].length != 0) {
    c3.generate({
      bindto: '#chartPublications',
      data: publication_by_year_bar_chart_data,
      legend: {
        show: false,
        item: {
          onclick: function () {},
        },
      },
      axis: {
        x: {
          label: {
            text: 'Year',
            position: 'outer-center',
          },
        },
        y: {
          label: {
            text: 'Number of Publications',
            position: 'outer-middle',
          },
        },
      },
    });
  }
}

function drawGrantsByAgency() {
  const grants_agency_chart_data: any = JSON.parse(
    document.getElementById('grants-agency-chart-data')!.textContent!
  );
  if (grants_agency_chart_data['columns'].length != 0) {
    c3.generate({
      bindto: '#chartGrants',
      data: grants_agency_chart_data,
      donut: {
        title: 'Grants',
      },
      legend: {
        item: {
          onclick: function () {},
        },
      },
    });
  }
}

function get_allocation_summary() {
  $.ajax({
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    type: 'GET',
    url: '/allocation-summary',
    success: function (data) {
      $('#allocation-summary').html(data);
    },
  });
}

function get_allocation_by_fos() {
  $.ajax({
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    type: 'GET',
    url: '/allocation-by-fos',
    success: function (data) {
      $('#allocation-by-fos').html(data);
      new DataTable('#fos-table', {
        pageLength: 10,
        orderClasses: false,
        order: [[1, 'desc']],
      });
    },
  });
}
