const PDFDocument = require('pdfkit');
const db = require('../config/db');

exports.handleExport = async (req, res) => {
  const { paymentid } = req.query;
  const conn = await db.getConnection();

  try {
    const Payment = await conn.query(`
      SELECT 
        p.paymentid,
        p.teacher_id,
        p.suphourCourse,
        p.suphourTut,
        p.suphourLab,
        p.status,
        p.period_id,
        p.suphour,
        p.rank_id,
        u.full_name AS teacherName,
        r.name AS latestRank
      FROM Payment p
      JOIN User u ON u.user_id = p.teacher_id
      LEFT JOIN (
        SELECT tr1.teacher_id, rk.name
        FROM TeacherRankHistory tr1
        JOIN Ranks rk ON rk.rank_id = tr1.rank_id
        WHERE tr1.end_date IS NULL
      ) r ON r.teacher_id = p.teacher_id
      WHERE p.paymentid = ?
    `, [paymentid]);

    if (!Payment || Payment.length === 0) {
      return res.status(404).send('Payment not found');
    }

    const rank = await conn.query(`SELECT Payment FROM Ranks WHERE rank_id = ?`, [Payment[0].rank_id]);
    const rate = rank[0]?.Payment || 0;

    const courseHours = Payment[0].suphourCourse / 60 || 0;
    const tutHours = Payment[0].suphourTut / 60 || 0;
    const labHours = Payment[0].suphourLab / 60 || 0;
    const totalHours = courseHours + tutHours + labHours;

    const totalPayment = totalHours * rate;
    const socialSec = totalPayment * 0.09;
    const irg = (totalPayment - socialSec) * 0.10;
    const net = totalPayment - socialSec - irg;

    await conn.query(`UPDATE Payment SET totalPayment = ? WHERE paymentid = ?`, [totalPayment, paymentid]);

    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Payment_Report.pdf');
    doc.pipe(res);

    doc.fontSize(20).text('Payment Report', { align: 'center' }).moveDown();

    const status = Payment[0].status === 0 ? 'Unpaid' : 'Paid';

    doc.fontSize(12)
      .text(`Teacher: ${Payment[0].teacherName}`)
      .text(`Rank: ${Payment[0].latestRank || 'N/A'}`)
      .text(`Period Number this year: ${Payment[0].period_id}`)
      .moveDown()
      .text('-------------------- Payment Details --------------------')
      .moveDown();

    // Table header
    doc.font('Helvetica-Bold')
      .text('Type', 50, doc.y, { continued: true })
      .text('Hours', 150, doc.y, { continued: true })
      .text('Amount (DA)', 250)
      .font('Helvetica');

    doc.text('Course', 50, doc.y, { continued: true })
      .text(courseHours.toFixed(2), 150, doc.y, { continued: true })
      .text('-', 250);

    doc.text('Tutoring', 50, doc.y, { continued: true })
      .text(tutHours.toFixed(2), 150, doc.y, { continued: true })
      .text('-', 250);

    doc.text('Lab', 50, doc.y, { continued: true })
      .text(labHours.toFixed(2), 150, doc.y, { continued: true })
      .text('-', 250);

    doc.moveDown(0.5);

    doc.text('Total Hours', 50, doc.y, { continued: true })
      .text(totalHours.toFixed(2), 150, doc.y, { continued: true })
      .text('-', 250);

    doc.text('Total Payment', 50, doc.y, { continued: true })
      .text('-', 150, doc.y, { continued: true })
      .text((totalPayment).toFixed(2), 250);

    doc.text('Social Sec (9%)', 50, doc.y, { continued: true })
      .text('-', 150, doc.y, { continued: true })
      .text((socialSec).toFixed(2), 250);

    doc.text('IRG (10%)', 50, doc.y, { continued: true })
      .text('-', 150, doc.y, { continued: true })
      .text((irg).toFixed(2), 250);

    doc.font('Helvetica-Bold')
      .text('Net Payment', 50, doc.y, { continued: true })
      .text('-', 150, doc.y, { continued: true })
      .text(net.toFixed(2) + ' DA', 250)
      .font('Helvetica');

    doc.moveDown()
      .text(`Status: ${status}`)
      .text('--------------------------------------------------');

    doc.end();

  } catch (err) {
    console.error('Export error:', err);
    res.status(500).send('PDF export failed.');
  } finally {
    if (conn) conn.release();
  }
};



const ExcelJS = require('exceljs');

exports.exportExcel = async (req, res) => {
  const conn = await db.getConnection();

  try {
    const payments = await conn.query(`
      SELECT 
        p.paymentid,
        p.teacher_id,
        p.suphourCourse,
        p.suphourTut,
        p.suphourLab,
        p.status,
        p.period_id,
        p.suphour,
        p.rank_id,
        u.full_name AS teacherName,
        u.state AS State,
        r.name AS latestRank,
        rk.Payment AS rate
      FROM Payment p
      JOIN User u ON u.user_id = p.teacher_id
      LEFT JOIN (
        SELECT tr1.teacher_id, rk.name
        FROM TeacherRankHistory tr1
        JOIN Ranks rk ON rk.rank_id = tr1.rank_id
        WHERE tr1.end_date IS NULL
      ) r ON r.teacher_id = p.teacher_id
      LEFT JOIN Ranks rk ON rk.rank_id = p.rank_id
    `);
    console.log("state", payments[0].State)
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Payments');

    worksheet.columns = [
      { header: 'Teacher', key: 'teacherName', width: 25 },
      { header: 'Rank', key: 'latestRank', width: 20 },
      { header: 'State', key: 'State', width: 20 },
      { header: 'Course Hours', key: 'courseHours', width: 15 },
      { header: 'Tutoring Hours', key: 'tutoringHours', width: 15 },
      { header: 'Lab Hours', key: 'labHours', width: 15 },
      { header: 'Total Hours', key: 'totalHours', width: 15 },
      { header: 'Total Payment (DA)', key: 'totalPayment', width: 20 },
      { header: 'Social Sec (9%)', key: 'socialSec', width: 18 },
      { header: 'IRG (10%)', key: 'irgTax', width: 15 },
      { header: 'Net Payment', key: 'netPayment', width: 18 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Period', key: 'period_id', width: 10 },
    ];

    for (const Payment of payments) {
      const totalHours =
        (Payment.suphourCourse / 60 || 0) +
        (Payment.suphourTut / 60 || 0) +
        (Payment.suphourLab / 60 || 0);

      const totalPayment = totalHours * (Payment.rate || 0);
      const socialSec = totalPayment * 0.09;
      const irgTax = (totalPayment - socialSec) * 0.10;
      const netPayment = totalPayment - socialSec - irgTax;

      worksheet.addRow({
        teacherName: Payment.teacherName,
        latestRank: Payment.latestRank || 'N/A',
        State: Payment.State || 'N/A',
        courseHours: Payment.suphourCourse / 60,
        tutoringHours: Payment.suphourTut / 60,
        labHours: Payment.suphourLab / 60,
        totalHours,
        totalPayment: (totalPayment ).toFixed(2),
        socialSec: (socialSec ).toFixed(2),
        irgTax: (irgTax ).toFixed(2),
        netPayment: (netPayment ).toFixed(2),
        status: Payment.status === 0 ? 'Unpaid' : 'Paid',
        period_id: Payment.period_id
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=All_Teachers_Payment_Report.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel export error:', err);
    res.status(500).send('Excel export failed.');
  } finally {
    if (conn) conn.release();
  }
};