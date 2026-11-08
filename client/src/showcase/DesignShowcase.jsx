import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Textarea,
  Dialog,
  ConfirmDialog,
  Dropdown,
  Badge,
  Avatar,
  Card,
  CardContent,
  RestaurantCardSkeleton,
  FoodCardSkeleton,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Pagination,
  EmptyState,
  LoadingState,
  ErrorState,
} from '@/components/ui';
import {
  RestaurantCard,
  FoodCard,
  OrderStatusBadge,
  RatingStars,
  PriceDisplay,
  PageHeader,
  DietaryIndicator,
} from '@/components/food';
import { useToast } from '@/context/ToastContext';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Utensils,
  Search,
} from 'lucide-react';

export default function DesignShowcase() {
  const { success, error, warning, info } = useToast();

  // State for interactive component demos
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [sampleFoodQty, setSampleFoodQty] = useState(1);
  const [interactiveRating, setInteractiveRating] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [btnLoading, setBtnLoading] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-charcoal py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* ── Brand Header ────────────────────────────────────────── */}
      <PageHeader
        title="FoodHub Design System"
        description="A refined, modern restaurant platform visual identity featuring warm off-white canvas, deep charcoal typography, sophisticated terracotta accents, and soft tactile shadows."
        breadcrumbs={
          <>
            <span>Components</span>
            <span>/</span>
            <span className="text-terracotta-600 font-semibold">Design Showcase</span>
          </>
        }
        badge={
          <Badge variant="terracotta" size="sm" icon={<Sparkles className="w-3 h-3" />}>
            Design Tokens v1.0
          </Badge>
        }
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => info('Design Docs', 'Reviewing component tokens and guidelines')}
            >
              Guidelines
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 1500);
              }}
              isLoading={btnLoading}
            >
              Simulate Action
            </Button>
          </div>
        }
      />

      {/* ── 1. Color Palette Tokens ───────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
          <span>01.</span> Brand Color Tokens
        </h2>
        <p className="text-sm text-charcoal-secondary">
          Crafted to evoke authentic gastronomy, warm parchment menus, and elevated dining ambiance.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-canvas border border-neutralBorder rounded-xl p-3 shadow-warm-xs">
            <div className="h-12 w-full rounded-lg bg-canvas border border-neutralBorder-light mb-2" />
            <p className="text-xs font-bold text-charcoal">Canvas</p>
            <p className="text-[10px] text-charcoal-muted font-mono">#FAF8F5</p>
          </div>
          <div className="bg-surface border border-neutralBorder rounded-xl p-3 shadow-warm-xs">
            <div className="h-12 w-full rounded-lg bg-surface border border-neutralBorder-light mb-2" />
            <p className="text-xs font-bold text-charcoal">Surface Card</p>
            <p className="text-[10px] text-charcoal-muted font-mono">#FFFFFF</p>
          </div>
          <div className="bg-surface border border-neutralBorder rounded-xl p-3 shadow-warm-xs">
            <div className="h-12 w-full rounded-lg bg-charcoal mb-2" />
            <p className="text-xs font-bold text-charcoal">Charcoal Ink</p>
            <p className="text-[10px] text-charcoal-muted font-mono">#1C1917</p>
          </div>
          <div className="bg-surface border border-neutralBorder rounded-xl p-3 shadow-warm-xs">
            <div className="h-12 w-full rounded-lg bg-terracotta-500 mb-2" />
            <p className="text-xs font-bold text-charcoal">Terracotta</p>
            <p className="text-[10px] text-charcoal-muted font-mono">#C85A32</p>
          </div>
          <div className="bg-surface border border-neutralBorder rounded-xl p-3 shadow-warm-xs">
            <div className="h-12 w-full rounded-lg bg-culinary-veg mb-2" />
            <p className="text-xs font-bold text-charcoal">Sage Veg</p>
            <p className="text-[10px] text-charcoal-muted font-mono">#2D6A4F</p>
          </div>
          <div className="bg-surface border border-neutralBorder rounded-xl p-3 shadow-warm-xs">
            <div className="h-12 w-full rounded-lg bg-culinary-nonveg mb-2" />
            <p className="text-xs font-bold text-charcoal">Ruby Non-Veg</p>
            <p className="text-[10px] text-charcoal-muted font-mono">#9E2A2B</p>
          </div>
        </div>
      </section>

      {/* ── 2. Action Buttons & Steppers ──────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
          <span>02.</span> Buttons & Interactive Triggers
        </h2>
        <Card>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Terracotta</Button>
              <Button variant="secondary">Secondary Surface</Button>
              <Button variant="outline">Outline Accent</Button>
              <Button variant="ghost">Ghost Trigger</Button>
              <Button variant="danger">Destructive Action</Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutralBorder-light">
              <Button variant="primary" size="sm" leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}>
                Small Button
              </Button>
              <Button variant="secondary" size="md" leftIcon={<Heart className="w-4 h-4 text-terracotta-500" />}>
                Medium Button
              </Button>
              <Button variant="primary" size="lg" rightIcon={<Utensils className="w-4 h-4" />}>
                Large CTA Button
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── 3. Form Controls & Inputs ─────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
          <span>03.</span> Form Components
        </h2>
        <Card>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Search Restaurant or Dish"
              placeholder="e.g. Royal Biryani, MP Nagar"
              leftIcon={<Search className="w-4 h-4" />}
            />
            <Input
              label="Customer Email"
              type="email"
              placeholder="customer@foodhub.com"
              hint="We will send your order confirmation here"
            />
            <Select label="Select Operational City" required>
              <option value="Bhopal">Bhopal, Madhya Pradesh</option>
              <option value="Indore">Indore, Madhya Pradesh</option>
              <option value="Mumbai">Mumbai, Maharashtra</option>
              <option value="Delhi">Delhi NCR</option>
            </Select>
            <Input
              label="Promo Code"
              defaultValue="EXPIRED10"
              error="This promotional coupon has expired"
            />
            <div className="md:col-span-2">
              <Textarea
                label="Kitchen Delivery Notes"
                placeholder="e.g. Ring the bell twice, keep it medium spicy."
                hint="Maximum 150 characters"
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── 4. Overlays, Dialogs & Dropdown ───────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
          <span>04.</span> Modals, Dialogs & Dropdown Menus
        </h2>
        <Card>
          <CardContent className="flex flex-wrap items-center gap-4">
            <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>
              Open Food Item Modal
            </Button>

            <Button variant="outline" onClick={() => setIsConfirmOpen(true)}>
              Open Destructive Confirm Dialog
            </Button>

            {/* Dropdown Menu Demo */}
            <Dropdown
              trigger={
                <Button variant="secondary" rightIcon={<MoreVertical className="w-4 h-4" />}>
                  Manage Restaurant
                </Button>
              }
              items={[
                { label: 'Edit Menu Item', icon: <Edit className="w-4 h-4" />, onClick: () => info('Menu', 'Navigating to editor') },
                { label: 'View Public Page', icon: <ExternalLink className="w-4 h-4" />, onClick: () => success('Preview', 'Opening restaurant profile') },
                { divider: true },
                { label: 'Delete Restaurant', icon: <Trash2 className="w-4 h-4" />, danger: true, onClick: () => setIsConfirmOpen(true) },
              ]}
            />
          </CardContent>
        </Card>

        {/* Dialog Demo */}
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Dum Pukht Biryani Handi"
          description="Crafted with long-grain basmati and marinated chicken cooked on slow charcoal dum."
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-subtle rounded-xl border border-neutralBorder">
              <div className="flex items-center gap-2">
                <DietaryIndicator isVeg={false} size="md" />
                <span className="text-sm font-semibold text-charcoal">Non-Vegetarian</span>
              </div>
              <PriceDisplay price={420} size="lg" />
            </div>
            <p className="text-xs text-charcoal-secondary leading-relaxed">
              Cooked inside sealed earthen pots to trap delicate cardamom and saffron aromas. Served alongside spiced raita and mirchi ka salan.
            </p>
            <div className="flex justify-end gap-2 pt-4 border-t border-neutralBorder-light">
              <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  success('Added to Cart', 'Dum Pukht Biryani Handi added');
                  setIsDialogOpen(false);
                }}
              >
                Add to Cart • ₹420
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Confirm Dialog Demo */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            warning('Deleted', 'The selected item was removed.');
            setIsConfirmOpen(false);
          }}
          title="Delete Restaurant Profile?"
          description="This will permanently delete this restaurant and all associated menu items. Historic orders will remain archived."
          confirmText="Yes, Delete"
          isDestructive={true}
        />
      </section>

      {/* ── 5. Feedback, Toasts & Semantic Badges ─────────────────── */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
          <span>05.</span> Toasts, Badges & Avatars
        </h2>
        <Card>
          <CardContent className="space-y-6">
            <div>
              <p className="text-xs font-semibold text-charcoal-secondary uppercase tracking-wider mb-3">
                Interactive Toast Triggers
              </p>
              <div className="flex flex-wrap gap-2.5">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => success('Order Received', 'Your dinner order has been sent to the kitchen.')}
                >
                  Success Toast
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => error('Item Sold Out', 'The kitchen has just run out of Malai Kofta.')}
                >
                  Error Toast
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => warning('Restaurant Closing', 'This venue stops accepting orders in 15 mins.')}
                >
                  Warning Toast
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => info('City Updated', 'Now showing artisanal restaurants in Bhopal.')}
                >
                  Info Toast
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-neutralBorder-light">
              <p className="text-xs font-semibold text-charcoal-secondary uppercase tracking-wider mb-3">
                Badge Variants & Order Statuses
              </p>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="default">Neutral Tag</Badge>
                <Badge variant="terracotta">Featured Dining</Badge>
                <Badge variant="veg">Pure Vegetarian</Badge>
                <Badge variant="nonveg">Contains Meat</Badge>
                <Badge variant="gold">Chef's Special</Badge>
                <OrderStatusBadge status="placed" />
                <OrderStatusBadge status="preparing" />
                <OrderStatusBadge status="delivered" />
                <OrderStatusBadge status="cancelled" />
              </div>
            </div>

            <div className="pt-4 border-t border-neutralBorder-light flex items-center gap-4">
              <p className="text-xs font-semibold text-charcoal-secondary uppercase tracking-wider">
                User Avatars:
              </p>
              <Avatar name="Rahul Verma" size="sm" />
              <Avatar name="Aarav Sharma" size="md" />
              <Avatar name="Chef Sanjeev" size="lg" />
              <Avatar name="Pooja Merchant" size="xl" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── 6. Domain Components: FoodCard & RestaurantCard ───────── */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
          <span>06.</span> Domain Components (Restaurant & Food Cards)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Restaurant Card Demo */}
          <RestaurantCard
            restaurant={{
              _id: '67236b280200000000000001',
              name: 'The Royal Spice Court',
              city: 'Bhopal',
              area: 'MP Nagar Zone 1',
              cuisines: ['North Indian', 'Mughlai', 'Awadhi Dum Biryani'],
              isOpen: true,
            }}
            rating={4.8}
            reviewCount={240}
            onClick={() => info('Restaurant Selected', 'Opening The Royal Spice Court')}
          />

          {/* Food Cards Demo */}
          <div className="space-y-4">
            <FoodCard
              item={{
                _id: '1',
                name: 'Paneer Tikka Angara',
                category: 'Starters',
                price: 280,
                isVeg: true,
                isAvailable: true,
              }}
              quantity={sampleFoodQty}
              onAdd={() => setSampleFoodQty((q) => Math.min(q + 1, 20))}
              onRemove={() => setSampleFoodQty((q) => Math.max(q - 1, 0))}
              imageUrl="https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=250&q=80"
            />

            <FoodCard
              item={{
                _id: '2',
                name: 'Murgh Nizami Korma',
                category: 'Main Course',
                price: 380,
                isVeg: false,
                isAvailable: true,
              }}
              quantity={0}
              onAdd={() => success('Cart', 'Murgh Nizami Korma added')}
              imageUrl="https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=250&q=80"
            />

            <FoodCard
              item={{
                _id: '3',
                name: 'Kesar Phirni Clay Pot',
                category: 'Desserts',
                price: 160,
                isVeg: true,
                isAvailable: false,
              }}
              quantity={0}
            />
          </div>
        </div>
      </section>

      {/* ── 7. Rating Stars, Price Display & Tabs ─────────────────── */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
          <span>07.</span> Ratings, Prices & Tabs
        </h2>
        <Card>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-charcoal-secondary uppercase tracking-wider mb-2">
                  Interactive Star Review Picker
                </p>
                <div className="flex items-center gap-3">
                  <RatingStars
                    rating={interactiveRating}
                    isInteractive={true}
                    size="md"
                    onChange={(r) => {
                      setInteractiveRating(r);
                      success('Rating Selected', `You chose ${r} stars`);
                    }}
                  />
                  <span className="text-xs text-charcoal-muted">
                    (Click to rate: {interactiveRating} / 5)
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-charcoal-secondary uppercase tracking-wider mb-2">
                  Price Display Formats
                </p>
                <div className="flex items-center gap-4">
                  <PriceDisplay price={240} size="sm" />
                  <PriceDisplay price={450} originalPrice={550} size="md" />
                  <PriceDisplay price={1280} size="xl" />
                </div>
              </div>
            </div>

            {/* Tabs Demo */}
            <div className="pt-4 border-t border-neutralBorder-light">
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Dishes (24)</TabsTrigger>
                  <TabsTrigger value="veg" icon={<DietaryIndicator isVeg={true} size="sm" />}>
                    Vegetarian
                  </TabsTrigger>
                  <TabsTrigger value="nonveg" icon={<DietaryIndicator isVeg={false} size="sm" />}>
                    Non-Vegetarian
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <p className="text-xs text-charcoal-secondary">
                    Browsing all 24 curated dishes across Starters, Main Course, and Breads.
                  </p>
                </TabsContent>
                <TabsContent value="veg">
                  <p className="text-xs text-charcoal-secondary">
                    Filtered view: 14 Pure vegetarian recipes made with fresh paneer and vegetables.
                  </p>
                </TabsContent>
                <TabsContent value="nonveg">
                  <p className="text-xs text-charcoal-secondary">
                    Filtered view: 10 Non-vegetarian curries and tandoori specialties.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ── 8. Table & Pagination ─────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
          <span>08.</span> Data Table & Pagination
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono text-xs text-charcoal-muted">#ORD-9021</TableCell>
              <TableCell className="font-semibold text-charcoal">Vikramaditya Rao</TableCell>
              <TableCell>2x Butter Naan, 1x Paneer Tikka</TableCell>
              <TableCell>
                <PriceDisplay price={560} />
              </TableCell>
              <TableCell>
                <OrderStatusBadge status="preparing" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs text-charcoal-muted">#ORD-9020</TableCell>
              <TableCell className="font-semibold text-charcoal">Sneha Kulkarni</TableCell>
              <TableCell>1x Chicken Dum Biryani, 1x Raita</TableCell>
              <TableCell>
                <PriceDisplay price={420} />
              </TableCell>
              <TableCell>
                <OrderStatusBadge status="delivered" />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs text-charcoal-muted">#ORD-9019</TableCell>
              <TableCell className="font-semibold text-charcoal">Arjun Nambiar</TableCell>
              <TableCell>1x Dal Makhani, 2x Roti</TableCell>
              <TableCell>
                <PriceDisplay price={310} />
              </TableCell>
              <TableCell>
                <OrderStatusBadge status="placed" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Pagination
          page={currentPage}
          totalPages={5}
          onPageChange={(p) => {
            setCurrentPage(p);
            info('Page Changed', `Navigated to table page ${p}`);
          }}
        />
      </section>

      {/* ── 9. Empty, Loading & Error States ──────────────────────── */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-charcoal flex items-center gap-2">
          <span>09.</span> Asynchronous & Edge States
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EmptyState
            icon={ShoppingBag}
            title="Your Cart is Empty"
            description="Explore our curated restaurant menus to add fresh dishes to your dining order."
            action={
              <Button variant="secondary" size="sm">
                Explore Restaurants
              </Button>
            }
          />

          <LoadingState message="Connecting to Kitchen Dispatch…" />

          <ErrorState
            title="Failed to Load Menu"
            message="Unable to fetch restaurant catalog from the database server."
            onRetry={() => success('Retried', 'Re-fetching catalog successfully')}
          />
        </div>

        {/* Skeleton Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <RestaurantCardSkeleton />
          <div className="space-y-4">
            <FoodCardSkeleton />
            <FoodCardSkeleton />
          </div>
        </div>
      </section>
    </div>
  );
}

