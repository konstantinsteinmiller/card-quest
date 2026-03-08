<script setup lang="ts">
import type {GameCard} from '@/types/game'

defineProps<{
  cards: GameCard[]
  isPlayer?: boolean
}>()

const emit = defineEmits<{
  (e: 'dragstart', event: DragEvent, card: GameCard): void
}>()
</script>