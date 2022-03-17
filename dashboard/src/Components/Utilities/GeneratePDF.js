import React from 'react'
import jsPDF from 'jspdf';
import {Button} from '@material-ui/core'
import 'jspdf-autotable'

function GeneratePDF(data){
  let form_data = data;
  console.log("In generate PDF");
  console.log(form_data);


  let doc = new jsPDF();
  // form_data.forEach(function(field, i){
  //   doc.text(20, 10 + (i*10),
  //   field)
  // })

  const row = [];
  doc.setFont("courier");
  row.push([1, "User Name ", form_data["Name"]]);
  row.push([2, "Designation ", form_data["Designation"]]);
  row.push([3, "Department ", form_data["Department"]]);
  row.push([4, "Advance Required ", form_data["Advance Required"]]);
  row.push([5, "Encashment Required ", form_data["Encashment Required"]]);
  row.push([6, "No of Days", form_data["No of Days"]]);
  row.push([7, "User Name ", form_data["Name"]]);

  // doc.text(20, 20, "User Name: "+form_data["Name"]);
  // doc.text(20, 30, "Designation: "+form_data["Designation"]);
  // doc.text(20, 40, "Department: "+form_data["Department"]);
  // doc.text(20, 50, "Advance Required: "+form_data["Advance Required"]);
  // doc.text(20, 60, "Encashment Required: "+form_data["Encashment Required"]);
  // doc.text(20, 70, "No of Days: "+form_data["No of Days"]);

  doc.autoTable({
    head: null,
    body: row,
    bodyStyles: { lineWidth: 1 },
    tableWidth: "auto",
  });

  doc.save('form.pdf');

}


export default GeneratePDF