const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testCourse() {
  try {
    const courseId = '68828be11226f72258bd50e3' // The failing ID
    
    console.log('Testing course ID:', courseId)
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })
    
    console.log('Course found:', course ? 'YES' : 'NO')
    
    if (course) {
      console.log('Course details:')
      console.log('- Title:', course.title)
      console.log('- Published:', course.publishedAt)
      console.log('- Created:', course.createdAt)
    }
    
    // Check first few courses
    console.log('\nFirst 3 courses in database:')
    const allCourses = await prisma.course.findMany({
      take: 3,
      select: { id: true, title: true, publishedAt: true }
    })
    
    allCourses.forEach(c => {
      console.log(`- ${c.id}: ${c.title} (Published: ${c.publishedAt ? 'Yes' : 'No'})`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCourse()
