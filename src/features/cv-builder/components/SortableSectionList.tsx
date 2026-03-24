import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useCVStore } from '../store/cvStore'

const SECTION_NAMES: Record<string, string> = {
  summary: 'Giới thiệu bản thân',
  experience: 'Kinh nghiệm làm việc',
  education: 'Học vấn',
  projects: 'Dự án nổi bật',
  certifications: 'Chứng chỉ',
  skills: 'Kỹ năng'
}

const SortableItem = ({ id }: { id: string }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '6px',
        marginBottom: '8px',
        color: '#cbd5e1',
        fontSize: '14px',
        fontWeight: 500,
        ...attributes
      }}
    >
      <div 
        {...listeners}
        style={{ cursor: 'grab', marginRight: '8px', color: '#64748b', display: 'flex' }}
      >
        <GripVertical size={16} />
      </div>
      {SECTION_NAMES[id] || id}
    </div>
  )
}

export const SortableSectionList = () => {
  const { sectionsOrder, setSectionsOrder } = useCVStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = sectionsOrder.indexOf(active.id as string)
      const newIndex = sectionsOrder.indexOf(over.id as string)
      
      setSectionsOrder(arrayMove(sectionsOrder, oldIndex, newIndex))
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={sectionsOrder}
        strategy={verticalListSortingStrategy}
      >
        <div style={{ padding: '4px 0' }}>
          {sectionsOrder.map((id) => (
            <SortableItem key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
