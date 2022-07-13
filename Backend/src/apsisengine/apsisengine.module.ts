import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ApsisengineController } from './apsisengine.controller';
import { ApsisengineService } from './apsisengine.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import {
  JwtRefreshTokenStrategy,
  JwtStrategy,
  LocalStrategy,
} from './auth/strategy';
import { MasterGridController } from './master-grid/master-grid.controller';
import { MasterGridService } from './master-grid/index';
import { MasterFormController } from './masterform/masterform.controller';
import { MasterFormService } from './masterform/masterform.service';
import { ModuleChangerService } from './modulechanger/index';
import { ModulechangerController } from './modulechanger/modulechanger.controller';
import { DropdownController } from './dropdown/dropdown.controller';
import { DropdownService } from './dropdown/index';
import { CompanyController } from './masterdata/company/company.controller';
import { CompanyService } from './masterdata/company/company.service';
import { BranchController } from './masterdata/branch/branch.controller';
import { BranchService } from './masterdata/branch/branch.service';
import { CompanymoduleController } from './masterdata/companymodule/companymodule.controller';
import { CompanymoduleService } from './masterdata/companymodule/companymodule.service';
import { DepartmentController } from './masterdata/department/department.controller';
import { DepartmentService } from './masterdata/department/department.service';
import { DivisionController } from './masterdata/division/division.controller';
import { DivisionService } from './masterdata/division/division.service';
import { FeatureController } from './masterdata/feature/feature.controller';
import { FeatureService } from './masterdata/feature/feature.service';
import { ModuleController } from './masterdata/module/module.controller';
import { ModuleService } from './masterdata/module/module.service';
import { MenuController } from './menu/menu.controller';
import { MenuService } from './menu/menu.service';
import { DelegationService } from './delegation/index';
import { DelegationController } from './delegation/delegation.controller';
//import { AfterDelegationService } from './delegation/after-delegation.service';
import { FormMetaService } from './masterform/form-meta/form-meta.service';
import MessageHelper from './common/helpers/messageHelper';
import { AutocompleteService } from './autocomplete/index';
import { AutocompleteController } from './autocomplete/autocomplete.controller';
import StatusflowHelper from './common/helpers/StatusflowHelper';
import { MessageController } from './common/message/message.controller';
import { TreeController } from './tree/tree.controller';
import { TreeService } from './tree/index';
import { LoggerActivityService } from './logger-activity/logger-activity.service';
import { AuditTrailService } from './audit-trail/audit-trail.service';
import { DelegationConfController } from './delegation/delegation-conf.controller';
import { DelegationConfService } from './delegation/delegation-conf.service';
import { SessionFilterService } from './session-filter';
import CommonHelper from './common/helpers/commonHelper';
// import { StockReconciliationService } from 'src/modules/supplychain/stock-reconciliation/stock_reconciliation.service';
// import { StockReconciliationController } from 'src/modules/supplychain/stock-reconciliation/stock_reconciliation.controller';
import { DynamicJsonController } from './dynamic-json/dynamic_json.controller';
import { DynamicJsonService } from './dynamic-json/dynamic_json.service';
//import { ChalanService } from 'src/modules/supplychain/chalan/chalan.service';
import { CommonApiService } from './common-api/common-api.service';
import { CommonApiController } from './common-api/common-api.controller';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { IdLogicController } from './idlogic/idlogic.controller';
import { CommentChatController } from './comment-chat/comment-chat.controller';
import { CommentChatService } from './comment-chat/comment-chat.service';
//import { RentalScheduleService } from 'src/modules/rental/agreements/rental-schedule.service';
import Common_function from 'src/global/common_function.service';
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [
    ApsisengineController,
    AuthController,
    MasterFormController,
    MasterGridController,
    DelegationController,
    ModulechangerController,
    DropdownController,
    CompanyController,
    // BranchController,
    CompanymoduleController,
    DepartmentController,
    DivisionController,
    FeatureController,
    ModuleController,
    MenuController,
    AutocompleteController,
    MessageController,
    TreeController,
    DelegationConfController,
    //StockReconciliationController,
    CommonApiController,
    DynamicJsonController,
    RoleController,
    IdLogicController,
    CommentChatController,
  ],
  providers: [
    ApsisengineService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    MasterGridService,
    MasterFormService,
    ModuleChangerService,
    DropdownService,
    CompanyService,
    // BranchService,
    CompanymoduleService,
    DepartmentService,
    DivisionService,
    FeatureService,
    ModuleService,
    MenuService,
    DelegationService,
    //AfterDelegationService,
    DelegationConfService,
    FormMetaService,
    MessageHelper,
    AutocompleteService,
    StatusflowHelper,
    TreeService,
    LoggerActivityService,
    AuditTrailService,
    SessionFilterService,
    CommonHelper,
    //StockReconciliationService,
    DynamicJsonService,
    CommonApiService,
    //ChalanService,
    RoleService,
    CommentChatService,
    //RentalScheduleService,
    Common_function,
  ],
  exports: [DelegationService,  MessageHelper],
})
export class ApsisengineModule {}
