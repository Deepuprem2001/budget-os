import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const exportToPDF = async ({
  elementId,
  filename = 'budgetos-report.pdf',
  title = 'BudgetOS Financial Report',
}) => {
  const element = document.getElementById(elementId)
  if (!element) return

  // Temporarily force light background for PDF
  const originalBg = element.style.backgroundColor
  element.style.backgroundColor = '#ffffff'

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  })

  element.style.backgroundColor = originalBg

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth - 20
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 10

  // Add title
  pdf.setFontSize(18)
  pdf.setTextColor(40, 40, 40)
  pdf.text(title, 10, position)
  position += 8

  // Add date
  pdf.setFontSize(10)
  pdf.setTextColor(120, 120, 120)
  pdf.text(`Generated on ${new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })}`, 10, position)
  position += 8

  // Add content image
  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
  heightLeft -= (pageHeight - position)

  // Add extra pages if content overflows
  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(filename)
}