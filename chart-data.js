let data = {
  updated_at: "2020-05-30 16:01 (+09:00)",
  detail: {
    "pbs.twimg.com": {
      default: {
        addr: "192.229.237.96",
        ping: 82.80158,
        speed: 4131630.866009428,
      },
      best: {
        addr: "23.218.22.152",
        ping: 31.59994,
        speed: 5418494.280588841,
      },
    },
    "video.twimg.com": {
      default: {
        addr: "117.18.232.102",
        ping: 83.20048,
        speed: 714614.9237259405,
      },
      best: {
        addr: "184.31.10.236",
        ping: 113.59854,
        speed: 69792738.35819496,
      },
    },
  },
};

$(document).ready(() => drawTable(data));
