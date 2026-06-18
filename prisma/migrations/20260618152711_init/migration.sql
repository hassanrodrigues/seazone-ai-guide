-- CreateTable
CREATE TABLE "properties" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "property_type" TEXT NOT NULL,
    "bedroom_quantity" INTEGER NOT NULL,
    "bathroom_quantity" INTEGER NOT NULL,
    "guest_capacity" INTEGER NOT NULL,
    "address" JSONB NOT NULL,
    "operational" JSONB NOT NULL,
    "rules" JSONB NOT NULL,
    "amenities" JSONB NOT NULL,
    "host" JSONB NOT NULL,
    "images" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "generated_guides" (
    "property_code" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_guides_pkey" PRIMARY KEY ("property_code")
);

-- AddForeignKey
ALTER TABLE "generated_guides" ADD CONSTRAINT "generated_guides_property_code_fkey" FOREIGN KEY ("property_code") REFERENCES "properties"("code") ON DELETE CASCADE ON UPDATE CASCADE;
