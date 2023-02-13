import {Injectable, Logger} from '@nestjs/common';
import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from './pdf-fonts'

// pdfMake.vfs = pdfFonts.pdfMake.vfs;
//
// pdfMake.fonts = {
//     Poppins: {
//         normal: 'Poppins-Regular.ttf',
//         bold: 'Poppins-SemiBold.ttf',
//         italics: 'Poppins-Italic.ttf',
//         bolditalics: 'Poppins-Italic.ttf',
//     },
//     Sutonny: {
//         normal: 'sutonny.ttf',
//         bold: 'sutonny.ttf',
//         italics: 'sutonny.ttf',
//         bolditalics: 'sutonny.ttf',
//     },
//     Nikosh: {
//         normal: 'nikosh.ttf',
//         bold: 'nikosh.ttf',
//         italics: 'nikosh.ttf',
//         bolditalics: 'nikosh.ttf',
//     },
// };


//
// export const PDF_MAKE_LOGO = 'https://api.gadgetplanet.softlabit.com/api/upload/images/gadgetsplanet.png';
// var fonts = {
//     Roboto: {
//         normal: 'fonts/roboto/Roboto-Regular.ttf',
//         bold: 'fonts/roboto/Roboto-Medium.ttf',
//         italics: 'fonts/roboto/Roboto-Italic.ttf',
//         bolditalics: 'fonts/roboto/Roboto-MediumItalic.ttf'
//     }
// };
//
//
// let pdfmake = new Pdfmake(fonts);
//
// let orderData;

@Injectable()
export class PdfMakerService {
    private logger = new Logger(PdfMakerService.name);

    constructor(
    ) {
    }

    // /**
    //  * MOMENT DATE FUNCTIONS
    //  * getDateString
    //  */
    // async makePDF(data: any) {
    //     orderData = data;
    //
    //     let docDefination = await this.getInvoiceDocument(data);
    //
    //     let aPromise = new Promise((resolve, reject) => {
    //         /// all those stuffs
    //
    //         let pdfDoc = pdfmake.createPdfKitDocument(docDefination, {});
    //
    //         let writeStream = fs.createWriteStream('pdfs/test.pdf');
    //
    //         pdfDoc.pipe(writeStream);
    //         pdfDoc.end();
    //
    //         writeStream.on('finish', function () {
    //             console.timeEnd('creatingPDF')
    //             resolve('pdfs/test.pdf');
    //         });
    //
    //     })
    //
    //     return aPromise;
    // }
    //
    //
    // async getInvoiceDocument(data: Order) {
    //     const documentObject = {
    //         content: [
    //             {
    //                 columns: [
    //                     await this.getProfilePicObjectPdf(),
    //                     [
    //                         {
    //                             width: 'auto',
    //                             text: `www.gadgetsplanet.com`,
    //                             style: 'p',
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: `House: 09, Road : 14, Dhanmondi, Dhaka`,
    //                             style: 'p',
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: `Telephone: +880 9611677835`,
    //                             style: 'p',
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: `Email: info@gadgetsplanet.com`,
    //                             style: 'p',
    //                         },
    //                     ],
    //                     [
    //                         {
    //                             width: '*',
    //                             text: [
    //                                 `Invoice ID: `,
    //                                 {
    //                                     text: 'SL-' + data?.orderId,
    //                                     bold: true
    //                                 }
    //                             ],
    //                             style: 'p',
    //                             alignment: 'right'
    //                         },
    //                         {
    //                             width: '*',
    //                             text: `${this.utilsService.getPdfDateString(new Date(), 'll')} (${data?.user && data?.phoneNo ? data?.phoneNo : 'N/A'})`,
    //                             style: 'p',
    //                             alignment: 'right'
    //                         },
    //                     ]
    //                 ],
    //                 columnGap: 16
    //             }, // END TOP INFO SECTION
    //             {
    //                 canvas: [
    //                     {
    //                         type: 'line',
    //                         x1: 0,
    //                         y1: 5,
    //                         x2: 535,
    //                         y2: 5,
    //                         lineWidth: 0.5,
    //                         lineColor: '#E8E8E8'
    //                     }
    //                 ]
    //             }, // END TOP INFO BORDER
    //             {
    //                 columns: [
    //                     [
    //                         {
    //                             width: 'auto',
    //                             text: `Order Info:`,
    //                             style: 'p',
    //                             margin: [0, 8, 0, 0]
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: [
    //                                 `Order Id: `,
    //                                 {
    //                                     text: '#' + data?.orderId,
    //                                     bold: true
    //                                 }
    //                             ],
    //                             style: 'p',
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: `Date Added: ${this.utilsService.getPdfDateString(new Date(), 'll')}`,
    //                             style: 'p',
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: [
    //                                 `Payment Status: `,
    //                                 {
    //                                     text: data?.paymentStatus,
    //                                     bold: true
    //                                 }
    //                             ],
    //                             style: 'p',
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: [
    //                                 `Total Product: `,
    //                                 {
    //                                     text: `${data?.orderedItems.length}Items`,
    //                                     bold: true
    //                                 }
    //                             ],
    //                             style: 'p',
    //                         },
    //                     ],
    //                     {
    //                         width: '*',
    //                         alignment: 'left',
    //                         text: '',
    //                     }, // Middle Space for Make Column Left & Right
    //                     [
    //                         {
    //                             width: 'auto',
    //                             text: `Delivery Address:`,
    //                             style: ['p'],
    //                             margin: [0, 8, 0, 0]
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: [
    //                                 `Name: `,
    //                                 {
    //                                     text: data?.name,
    //                                     bold: true
    //                                 }
    //                             ],
    //                             style: 'p',
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: `Address: ${data?.shippingAddress}`,
    //                             style: ['pBn'],
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: [
    //                                 `Phone: `,
    //                                 {
    //                                     text: data?.phoneNo,
    //                                     bold: true
    //                                 }
    //                             ],
    //                             style: 'p',
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: data?.preferredDate && data?.preferredTime ? `(${this.utilsService.getPdfDateString(data?.preferredDate, 'll')} তারিখ ${data?.preferredTime} সময়ের মধ্যে ডেলিভারি দিবেন)` : '',
    //                             style: ['pBn'],
    //                         },
    //                     ],
    //                 ],
    //                 columnGap: 16
    //             },
    //             {
    //                 style: 'gapY',
    //                 columns: [
    //                     this.getItemTable(),
    //                 ]
    //             }, // END ITEM TABLE SECTION
    //             {
    //                 style: 'gapY',
    //                 columns: [
    //                     [
    //                         {
    //                             width: 'auto',
    //                             text: [
    //                                 `Preferred Delivery Time: `,
    //                                 {
    //                                     // text: '#' + data.preferredDate && data.preferredTime  ? data.preferredTime +' '+ this.datePipe.transform(data.preferredDate, 'MMM d, y') : 'N/A',
    //                                     bold: true
    //                                 }
    //                             ],
    //                             style: 'p',
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: [
    //                                 `Note: `,
    //                                 {
    //                                     text: '#' + data.note && data.note !== null ? data.note : 'N/A',
    //                                     bold: true
    //                                 }
    //                             ],
    //                             style: 'p',
    //                         },
    //                     ],
    //                     {
    //                         width: '*',
    //                         alignment: 'left',
    //                         text: '',
    //                     }, // Middle Space for Make Column Left & Right
    //                     [
    //                         {
    //                             width: 'auto',
    //                             text: [
    //                                 {
    //                                     text: data?.productDiscount && data?.productDiscount > 0 ? `You Saved ${data?.productDiscount} TK from gadgetsplanet.com` : '',
    //                                     bold: true
    //                                 }
    //                             ],
    //                             style: 'p',
    //                         },
    //                         this.getCalculationTable()
    //                     ]
    //                 ]
    //             }, // END CALCULATION SECTION
    //             {
    //                 canvas: [
    //                     {
    //                         type: 'line',
    //                         x1: 0,
    //                         y1: 5,
    //                         x2: 535,
    //                         y2: 5,
    //                         lineWidth: 0.5,
    //                         lineColor: '#E8E8E8'
    //                     }
    //                 ]
    //             }, // END TOP INFO BORDER
    //             {
    //                 text: 'Thank you for your order from www.gadgetsplanet.com',
    //                 style: 'p',
    //                 alignment: 'center',
    //                 margin: [0, 10]
    //             },
    //             {
    //                 style: 'gapXY',
    //                 columns: [
    //                     [
    //                         {
    //                             canvas: [
    //                                 {
    //                                     type: 'line',
    //                                     x1: 0,
    //                                     y1: 5,
    //                                     x2: 100,
    //                                     y2: 5,
    //                                     lineWidth: 1,
    //                                     lineColor: '#767676',
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             width: 'auto',
    //                             text: [
    //                                 `Received By `,
    //                             ],
    //                             style: 'p',
    //                             margin: [22, 10]
    //                         }
    //                     ],
    //                     {
    //                         width: '*',
    //                         alignment: 'left',
    //                         text: '',
    //                     }, // Middle Space for Make Column Left & Right
    //                     [
    //                         {
    //                             alignment: 'right',
    //                             canvas: [
    //                                 {
    //                                     type: 'line',
    //                                     x1: 0,
    //                                     y1: 5,
    //                                     x2: 100,
    //                                     y2: 5,
    //                                     lineWidth: 1,
    //                                     lineColor: '#767676',
    //                                 }
    //                             ]
    //                         },
    //                         {
    //                             width: '100',
    //                             text: [
    //                                 `Authorized By `,
    //                             ],
    //                             style: 'p',
    //                             alignment: 'right',
    //                             margin: [22, 10]
    //                         }
    //                     ],
    //                 ]
    //             },
    //         ],
    //         defaultStyle: {
    //             font: 'Poppins'
    //         },
    //         styles: this.pdfMakeStyleObject
    //     }
    //
    //     return documentObject;
    // }
    //
    //
    // async getProfilePicObjectPdf() {
    //     return {
    //         image: await this.getBase64ImageFromURL(PDF_MAKE_LOGO),
    //         width: 50,
    //         alignment: 'left'
    //     };
    // }
    //
    //
    // getBase64ImageFromURL(url): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         var img = new Image();
    //         img.setAttribute('crossOrigin', 'anonymous');
    //
    //         img.onload = () => {
    //             var canvas = document.createElement('canvas');
    //             canvas.width = img.width;
    //             canvas.height = img.height;
    //
    //             var ctx = canvas.getContext('2d');
    //             ctx.drawImage(img, 0, 0);
    //
    //             var dataURL = canvas.toDataURL('image/png');
    //
    //             resolve(dataURL);
    //         };
    //
    //         img.onerror = error => {
    //             reject(error);
    //         };
    //
    //         img.src = url;
    //     });
    // }
    //
    //
    // getItemTable() {
    //     return {
    //         table: {
    //             widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto', 'auto'],
    //             body: this.dataTableForPdfMake()
    //         }
    //     };
    // }
    //
    // dataTableForPdfMake() {
    //     const tableHead = [
    //         {
    //             text: 'SL',
    //             style: 'tableHead',
    //             // border: [true, true, true, true],
    //             fillColor: '#DEDEDE',
    //             borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //         },
    //         {
    //             text: 'Product',
    //             style: 'tableHead',
    //             // border: [true, true, true, true],
    //             fillColor: '#DEDEDE',
    //             borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //         },
    //         {
    //             text: 'Unit',
    //             style: 'tableHead',
    //             fillColor: '#DEDEDE',
    //             borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //         },
    //         {
    //             text: 'Quantity',
    //             style: 'tableHead',
    //             fillColor: '#DEDEDE',
    //             borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //         },
    //         {
    //             text: 'Discount',
    //             style: 'tableHead',
    //             fillColor: '#DEDEDE',
    //             borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //         },
    //         {
    //             text: 'Price',
    //             style: 'tableHead',
    //             fillColor: '#DEDEDE',
    //             borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //         },
    //         {
    //             text: 'Total',
    //             style: 'tableHead',
    //             fillColor: '#DEDEDE',
    //             borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //         },
    //     ];
    //
    //     const finalTableBody = [tableHead];
    //     orderData?.orderedItems.forEach((m, i) => {
    //         const res = [
    //             {
    //                 text: i + 1,
    //                 style: 'tableBody',
    //                 borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //             },
    //             {
    //                 text: m.name,
    //                 style: 'tableBody',
    //                 borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //             },
    //             {
    //                 text: m.unit,
    //                 style: 'tableBody',
    //                 borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //             },
    //             {
    //                 text: m.quantity,
    //                 style: 'tableBody',
    //                 borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //             },
    //             {
    //                 text: m.discountAmount,
    //                 style: 'tableBody',
    //                 borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //             },
    //             {
    //                 text: m.unitPrice,
    //                 style: 'tableBody',
    //                 borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //             },
    //             {
    //                 text: m.unitPrice * m.quantity,
    //                 style: 'tableBody',
    //                 borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //             },
    //         ];
    //         // @ts-ignore
    //         finalTableBody.push(res)
    //     })
    //
    //     return finalTableBody;
    //
    // }
    //
    // get pdfMakeStyleObject(): object {
    //     return {
    //         p: {
    //             font: 'Poppins',
    //             fontSize: 9,
    //         },
    //         pBn: {
    //             font: 'Nikosh',
    //             fontSize: 9,
    //             lineHeight: 2
    //         },
    //         tableHead: {
    //             font: 'Poppins',
    //             fontSize: 9,
    //             bold: true,
    //             margin: [5, 2],
    //         },
    //         tableBody: {
    //             font: 'Poppins',
    //             fontSize: 9,
    //             margin: [5, 2],
    //         },
    //         gapY: {
    //             margin: [0, 8]
    //         },
    //         gapXY: {
    //             margin: [0, 40]
    //         }
    //
    //     }
    // }
    //
    //
    // getCalculationTable() {
    //     return {
    //         table: {
    //             widths: ['*', '*'],
    //             body: [
    //                 [
    //                     {
    //                         text: 'SubTotal',
    //                         style: 'tableHead',
    //                         // border: [true, true, true, true],
    //                         borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //                     },
    //                     {
    //                         text: `${orderData.subTotal} TK`,
    //                         style: 'tableBody',
    //                         borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //                     }
    //                 ],
    //                 [
    //                     {
    //                         text: 'Delivery Charge',
    //                         style: 'tableHead',
    //                         // border: [true, true, true, true],
    //                         borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //                     },
    //                     {
    //                         text: `${orderData.deliveryCharge} TK`,
    //                         style: 'tableBody',
    //                         borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //                     }
    //                 ],
    //                 // [
    //                 //   {
    //                 //     text: 'Discount(-)',
    //                 //     style: 'tableHead',
    //                 //     // border: [true, true, true, true],
    //                 //     borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //                 //   },
    //                 //   {
    //                 //     text: `${this.order.discount} TK`,
    //                 //     style: 'tableBody',
    //                 //     borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //                 //   }
    //                 // ],
    //                 [
    //                     {
    //                         text: 'Grand Total',
    //                         style: 'tableHead',
    //                         // border: [true, true, true, true],
    //                         borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //                     },
    //                     {
    //                         text: `${orderData.grandTotal} TK`,
    //                         style: 'tableBody',
    //                         borderColor: ['#eee', '#eee', '#eee', '#eee'],
    //                     }
    //                 ],
    //             ]
    //         }
    //     };
    // }


}
