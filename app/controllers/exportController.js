const PDFDocument = require('pdfkit');
const db = require('../config/db');
const { stat } = require('fs');

exports.handleExport = async (req, res) => {
  const { paymentid } = req.query;
  const conn = await db.getConnection();

  try {

    const payment = await conn.query(`
      SELECT 
        p.paymentid,
        p.teacherid,
        p.suphourCourse,
        p.suphourTut,
        p.suphourLab,
        p.status,
        p.periodid,
        p.suphour,
        p.rankid,
        u.full_name AS teacherName,
        r.name AS latestRank
      FROM payment p
      JOIN user u ON u.user_id = p.teacherid
      LEFT JOIN (
        SELECT tr1.teacherid, rk.name
        FROM teacherrankhistory tr1
        JOIN ranks rk ON rk.rankid = tr1.rankid
        WHERE tr1.startdate = (
          SELECT MAX(tr2.startdate)
          FROM teacherrankhistory tr2
          WHERE tr2.teacherid = tr1.teacherid
        )
      ) r ON r.teacherid = p.teacherid
      WHERE p.paymentid = ?
    `, [paymentid]);

    if (!payment) {
      return res.status(404).send('Payment not found');
    }

    const rank = await conn.query(`
      SELECT payment FROM ranks WHERE rankid = ?
    `, [payment[0].rankid]);

    const rate = rank?.payment || 0;
    const totalHours = 
      (payment[0].suphourCourse || 0) + 
      (payment[0].suphourTut || 0) + 
      (payment[0].suphourLab || 0);
    const totalPayment = totalHours * rate;

    await conn.query(`
      UPDATE payment SET totalPayment = ? WHERE paymentid = ?
    `, [totalPayment, paymentid]);

    // Stream PDF directly to client
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Payment_Report.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Payment Report', { align: 'center' });
    doc.moveDown();
    let status;
    if(payment[0].status===0){
        status="Unpaid"
    }
    else{
        status="Paid"
    }
    doc
      .fontSize(12)
      .text(`Teacher: ${payment[0].teacherName}`)
      .text(`Rank: ${payment[0].latestRank || 'N/A'}`)
      .text(`Course Hours: ${payment[0].suphourCourse}`)
      .text(`Tutoring Hours: ${payment[0].suphourTut}`)
      .text(`Lab Hours: ${payment[0].suphourLab}`)
      .text(`Total Hours: ${totalHours}`)
      .text(`Total Payment: ${totalPayment} DA`)
      .text(`Status: ${status}`)
      .text(`Period ID: ${payment[0].periodid}`)
      .text('------------------------------');

    doc.end();
    

  } catch (err) {
    console.error('Export error:', err);
    res.status(500).send('PDF export failed.');
  }
  finally{
    if (conn){
        conn.release()
    }
  }
};
