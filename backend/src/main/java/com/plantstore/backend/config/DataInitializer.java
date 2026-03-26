package com.plantstore.backend.config;

import com.plantstore.backend.entity.Category;
import com.plantstore.backend.entity.Order;
import com.plantstore.backend.entity.OrderItem;
import com.plantstore.backend.entity.Plant;
import com.plantstore.backend.entity.PlantImage;
import com.plantstore.backend.entity.Role;
import com.plantstore.backend.entity.User;
import com.plantstore.backend.enums.OrderStatus;
import com.plantstore.backend.enums.RoleName;
import com.plantstore.backend.repository.CategoryRepository;
import com.plantstore.backend.repository.OrderRepository;
import com.plantstore.backend.repository.PlantRepository;
import com.plantstore.backend.repository.RoleRepository;
import com.plantstore.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PlantRepository plantRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseGet(() -> saveRole(RoleName.ROLE_ADMIN, "Gestiona configuraciones, catálogo, usuarios y ventas"));

        Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                .orElseGet(() -> saveRole(RoleName.ROLE_CUSTOMER, "Compra productos, consulta catálogo y gestiona pedidos"));

        if (userRepository.findByEmail("admin@plantstore.com").isEmpty()) {
            User admin = new User();
            admin.setFullName("Administrador Principal");
            admin.setEmail("admin@plantstore.com");
            admin.setPassword(passwordEncoder.encode("Admin123*"));
            admin.setPhone("999999999");
            admin.setEnabled(true);
            admin.setRoles(Set.of(adminRole, customerRole));
            userRepository.save(admin);
        }

        if (userRepository.findByEmail("cliente@plantstore.com").isEmpty()) {
            User customer = new User();
            customer.setFullName("Camila Rivera");
            customer.setEmail("cliente@plantstore.com");
            customer.setPassword(passwordEncoder.encode("Cliente123*"));
            customer.setPhone("987654321");
            customer.setEnabled(true);
            customer.setRoles(Set.of(customerRole));
            userRepository.save(customer);
        }

        if (categoryRepository.count() == 0) {
            categoryRepository.save(createCategory("Plantas de interior", "plantas-interior", "Plantas ideales para salas, oficinas y espacios acogedores."));
            categoryRepository.save(createCategory("Plantas de exterior", "plantas-exterior", "Variedades resistentes para terrazas, jardines y balcones."));
            categoryRepository.save(createCategory("Macetas y accesorios", "macetas-accesorios", "Complementos decorativos y de cuidado para tus plantas."));
        }

        seedPlants();
        seedOrder();
    }

    private Role saveRole(RoleName name, String description) {
        Role role = new Role();
        role.setName(name);
        role.setDescription(description);
        return roleRepository.save(role);
    }

    private Category createCategory(String name, String slug, String description) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setDescription(description);
        category.setActive(true);
        return category;
    }

    private void seedPlants() {
        Map<String, Category> categories = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(Category::getName, Function.identity()));

        List<Plant> plants = List.of(
                createPlant(
                        categories.get("Plantas de interior"),
                        "Monstera deliciosa",
                        "monstera-deliciosa",
                        "Follaje tropical con hojas abiertas y presencia decorativa.",
                        "Planta de interior de crecimiento vigoroso, ideal para salas iluminadas con luz indirecta. Sus hojas grandes y fenestradas ayudan a crear una apariencia fresca y premium en ambientes residenciales o comerciales.",
                        new BigDecimal("129.90"),
                        11,
                        "Monstera deliciosa",
                        "Maceta de 25 cm",
                        true,
                        "/seed/plants/monstera-deliciosa.jpg"
                ),
                createPlant(
                        categories.get("Plantas de interior"),
                        "Ficus lyrata",
                        "ficus-lyrata",
                        "Árbol compacto de interior con hojas anchas y elegantes.",
                        "Muy valorada en decoración por su silueta vertical y hojas tipo violín. Funciona bien en espacios de trabajo, recepciones o salas amplias donde se necesite una planta protagonista.",
                        new BigDecimal("149.90"),
                        7,
                        "Ficus lyrata",
                        "Altura 1.20 m",
                        true,
                        "/seed/plants/ficus-lyrata.jpg"
                ),
                createPlant(
                        categories.get("Plantas de interior"),
                        "Poto dorado",
                        "poto-dorado",
                        "Enredadera resistente para repisas, escritorios y estantes.",
                        "Variedad muy adaptable y de bajo mantenimiento, recomendada para usuarios que recién empiezan. Puede usarse colgante o guiada sobre soportes, con follaje verde jaspeado en tonos amarillos.",
                        new BigDecimal("49.90"),
                        18,
                        "Epipremnum aureum",
                        "Maceta de 15 cm",
                        false,
                        "/seed/plants/epipremnum-aureum.jpg"
                ),
                createPlant(
                        categories.get("Plantas de interior"),
                        "Zamioculca",
                        "zamioculca",
                        "Planta compacta, brillante y muy tolerante a poca luz.",
                        "Opción excelente para oficinas, departamentos y zonas con riego esporádico. Sus tallos carnosos y hojas firmes la vuelven una de las especies más prácticas para un catálogo urbano.",
                        new BigDecimal("89.90"),
                        13,
                        "Zamioculcas zamiifolia",
                        "Maceta de 18 cm",
                        false,
                        "/seed/plants/zamioculcas-zamiifolia.jpg"
                )
        );

        plants.stream()
                .filter(plant -> plantRepository.findBySlug(plant.getSlug()).isEmpty())
                .forEach(plantRepository::save);
    }

    private Plant createPlant(
            Category category,
            String name,
            String slug,
            String shortDescription,
            String description,
            BigDecimal price,
            Integer stock,
            String botanicalName,
            String sizeLabel,
            boolean featured,
            String imageUrl
    ) {
        Plant plant = new Plant();
        plant.setCategory(category);
        plant.setName(name);
        plant.setSlug(slug);
        plant.setShortDescription(shortDescription);
        plant.setDescription(description);
        plant.setPrice(price);
        plant.setStock(stock);
        plant.setBotanicalName(botanicalName);
        plant.setSizeLabel(sizeLabel);
        plant.setFeatured(featured);
        plant.setActive(true);

        PlantImage image = new PlantImage();
        image.setPlant(plant);
        image.setFileName(slug + ".jpg");
        image.setFileUrl(imageUrl);
        image.setPrimaryImage(true);
        plant.getImages().add(image);
        return plant;
    }

    private void seedOrder() {
        boolean seedOrderExists = orderRepository.findAll().stream()
                .anyMatch(order -> order.getNotes() != null && order.getNotes().contains("demo administrativa"));
        if (seedOrderExists) {
            return;
        }

        User customer = userRepository.findByEmail("cliente@plantstore.com").orElse(null);
        Plant monstera = plantRepository.findBySlug("monstera-deliciosa").orElse(null);
        Plant poto = plantRepository.findBySlug("poto-dorado").orElse(null);
        if (customer == null || monstera == null || poto == null) {
            return;
        }

        Order order = new Order();
        order.setUser(customer);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setCustomerName(customer.getFullName());
        order.setCustomerEmail(customer.getEmail());
        order.setCustomerPhone(customer.getPhone());
        order.setShippingAddress("Av. Primavera 245, Surco, Lima, Peru");
        order.setPaymentMethod("TRANSFERENCIA");
        order.setNotes("Orden ficticia generada para demo administrativa. Incluye una planta protagonista y una planta secundaria de bajo mantenimiento.");

        addOrderItem(order, monstera, 1);
        addOrderItem(order, poto, 2);

        BigDecimal total = order.getItems().stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        orderRepository.save(order);
    }

    private void addOrderItem(Order order, Plant plant, int quantity) {
        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setPlant(plant);
        item.setPlantName(plant.getName());
        item.setQuantity(quantity);
        item.setUnitPrice(plant.getPrice());
        item.setSubtotal(plant.getPrice().multiply(BigDecimal.valueOf(quantity)));
        order.getItems().add(item);
    }
}
