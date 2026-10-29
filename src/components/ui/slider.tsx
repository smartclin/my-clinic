"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";

function Slider({ className, ...props }: SliderPrimitive.Root.Props) {
	return (
		<SliderPrimitive.Root
			className={cn(
				"relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50",
				className
			)}
			data-slot='slider'
			{...props}
		>
			<SliderPrimitive.Control className='relative flex w-full items-center'>
				<SliderPrimitive.Track
					className='bg-muted relative h-1.5 w-full grow overflow-hidden rounded-full'
					data-slot='slider-track'
				>
					<SliderPrimitive.Indicator
						className='bg-primary absolute h-full'
						data-slot='slider-range'
					/>
				</SliderPrimitive.Track>
				<SliderPrimitive.Thumb
					className='border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50'
					data-slot='slider-thumb'
				/>
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };
