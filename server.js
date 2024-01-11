const express = require('express');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 4000;

app.use(cors()); // CORS hatalarını önlemek için cors middleware kullanılıyor

var values = {};

var graphs = {
    kompresor: {
        name: "kompresor",
        saatler: [20,24],
        datas: [87,92],
        scales: [75,100],
    },
    kompresor_isi: {
        name: "kompresor_isi",
        saatler: [20,24],
        datas: [20,25],
        scales: [10,29]
    },
    freze: {
        name: "freze",
        saatler: [20,24],
        datas: [285,315],
        scales: [250,400]
    },
    freze_2: {
        name: "freze_2",
        saatler: [20,24],
        datas: [2450,2680],
        scales: [2000,3000]
    },
};

var generateRandomData = (a,b) => {
    var data = [];
    for (var i = a[0] * 60; i <= a[1] * 60; i += 5) {
      var time = Math.floor(i / 60) + ':' + (i % 60 === 0 ? '00': i % 60);
      var temperature = Math.floor(Math.random() * (Number(b[1]) - Number(b[0]) + 1)) + Number(b[0]);
      data.push({ time: time, values: temperature });
    }
    return data;
}

var rastgeleSayiUret = (min,max) => {
    return (min + Math.random() * (max - min)).toFixed(2);
};

var yaziOlustur = (name,min,max) => {
    var sayi = setInterval(()=>{rastgeleSayiUret(min,max)},800);
    values[name] = {sayi: sayi};
}

yaziOlustur("kompresor_kwh",260,264,900);
yaziOlustur("freze_kwh",49,50,900);

var veriOlustur = (object) => {
    var datas = setInterval(()=>{generateRandomData([object.saatler[0],object.saatler[1]],[object.datas[0],object.datas[1]])},800);
    var scales = object.scales;
    values[object] = {names: object.name,datas: datas,scales: scales}
};

veriOlustur(graphs.kompresor);
veriOlustur(graphs.kompresor_isi);
veriOlustur(graphs.freze);
veriOlustur(graphs.freze_2);

app.listen(port, () => {
    console.log(`Sunucu Başarılı çalışıyor: ${port}`);
});

app.get(`/degerler`, (req, res) => {
    res.json(values);
});