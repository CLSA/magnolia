<?php
/**
 * reqn.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\database;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * reqn: record
 */
class reqn extends \cenozo\database\record
{
  /**
   * Override the parent method
   */
  public function load()
  {
    parent::load();

    if( !is_null( $this->id ) )
    {
      $this->assert_deadline();
      $this->save();
    }
  }

  /**
   * Override the parent method
   */
  public function save()
  {
    // track if this is a new reqn
    $is_new = is_null( $this->id );

    // make sure the deadline is appropriate
    if( $is_new )
    {
      $this->assert_deadline();
      $this->data_directory = static::generate_data_directory();
    }

    parent::save();

    // delete files if they are being set to null
    if( is_null( $this->funding_filename ) )
    {
      $filename = $this->get_filename( 'funding' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->ethics_filename ) )
    {
      $filename = $this->get_filename( 'ethics' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->agreement_filename ) )
    {
      $filename = $this->get_filename( 'agreement' );
      if( file_exists( $filename ) ) unlink( $filename );
    }
    if( is_null( $this->instruction_filename ) )
    {
      $filename = $this->get_filename( 'instruction' );
      if( file_exists( $filename ) ) unlink( $filename );
    }

    // if this is a new reqn then assign it to the first stage
    if( $is_new ) $this->proceed_to_next_stage();
  }

  public function delete()
  {
    $file_list = array();
    if( !is_null( $this->funding_filename ) ) $file_list[] = $this->get_filename( 'funding' );
    if( !is_null( $this->ethics_filename ) ) $file_list[] = $this->get_filename( 'ethics' );
    if( !is_null( $this->agreement_filename ) ) $file_list[] = $this->get_filename( 'agreement' );
    if( !is_null( $this->instruction_filename ) ) $file_list[] = $this->get_filename( 'instruction' );

    parent::delete();

    foreach( $file_list as $file ) unlink( $file );
  }

  /**
   * Returns the path to various files associated with the reqn
   * 
   * @param string $type Should be 'funding', 'ethics', 'agreement', 'instruction'
   * @return string
   * @access public
   */
  public function get_filename( $type )
  {
    $directory = '';
    if( 'funding' == $type ) $directory = FUNDING_LETTER_PATH;
    else if( 'ethics' == $type ) $directory = ETHICS_LETTER_PATH;
    else if( 'agreement' == $type ) $directory = AGREEMENT_LETTER_PATH;
    else if( 'instruction' == $type ) $directory = INSTRUCTION_FILE_PATH;
    else throw lib::create( 'exception\argument', 'type', $type, __METHOD__ );
    return sprintf( '%s/%s', $directory, $this->id );
  }

  /**
   * Check the reqn's deadline and change it to the next available deadline if needed
   * NOTE: This method will change the deadline_id column but not save the record
   * @access public
   */
  public function assert_deadline()
  {
    $deadline_class_name = lib::get_class_name( 'database\deadline' );

    $db_deadline = NULL;
    $change_deadline = false;
    if( is_null( $this->deadline_id ) )
    { // no deadline found
      $db_deadline = $deadline_class_name::get_next();
      $change_deadline = true;
    }
    else
    {
      $db_current_stage_type = $this->get_current_stage_type();
      if( is_null( $db_current_stage_type ) || 1 == $db_current_stage_type->rank )
      {
        if( 0 < $this->get_deadline()->date->diff( util::get_datetime_object() )->days )
        { // deadline has expired, get the next one
          $db_deadline = $deadline_class_name::get_next();
          $change_deadline = true;
        }
      }
    }

    if( $change_deadline )
    {
      if( is_null( $db_deadline ) )
        throw lib::create( 'exception\runtime',
          'Cannot proceed since there are no future deadlines defined.',
          __METHOD__ );
      $this->deadline_id = $db_deadline->id;
    }
  }

  /**
   * Returns the reqns current stage
   * @return database\stage
   * @access public
   */
  public function get_current_stage()
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'stage' );
    $select->add_column( 'id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );
    $modifier->where( 'datetime', '=', NULL );

    $stage_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_id ? lib::create( 'database\stage', $stage_id ) : NULL;
  }

  /**
   * Returns the reqn's current stage type
   * @return database\stage_type
   * @access public
   */
  public function get_current_stage_type()
  {
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $select = lib::create( 'database\select' );
    $select->from( 'stage' );
    $select->add_column( 'stage_type_id' );
    $modifier = lib::create( 'database\modifier' );
    $modifier->where( 'reqn_id', '=', $this->id );
    $modifier->where( 'datetime', '=', NULL );

    $stage_type_id = static::db()->get_one( sprintf( '%s %s', $select->get_sql(), $modifier->get_sql() ) );
    return $stage_type_id ? lib::create( 'database\stage_type', $stage_type_id ) : NULL;
  }

  /**
   * Returns the reqn's next stage type (NULL if there is no valid next stage type)
   * @return database\stage_type
   * @access public
   */
  public function get_next_stage_type()
  {
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );

    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to query reqn with no primary key.' );
      return NULL;
    }

    $db_current_stage_type = $this->get_current_stage_type();
    $db_next_stage_type = NULL;
    if( is_null( $db_current_stage_type ) )
    {
      $db_next_stage_type = $stage_type_class_name::get_unique_record( 'rank', 1 );
    }
    else
    {
      $db_stage = $this->get_current_stage();
      $stage_type_list = $db_current_stage_type->get_next_possible_stage_type_object_list();
      if( 1 == count( $stage_type_list ) )
      {
        $db_next_stage_type = current( $stage_type_list );
      }
      else if( 1 < count( $stage_type_list ) )
      {
        if( 'DSAC Selection' == $db_current_stage_type->name )
        {
          // the DSAC Selection stage type is special, if it is complete then the next stage is DSAC Review
          foreach( $stage_type_list as $db_stage_type )
          {
            if( 'DSAC Review' == $db_stage_type->name )
            {
              $db_next_stage_type = $db_stage_type;
              break;
            }
          }
        }
        else if( 'Second DSAC Decision' == $db_current_stage_type->name )
        {
          $db_review = current( $db_stage->get_review_object_list() );
          if( $db_review )
          {
            $db_recommendation_type = $db_review->get_recommendation_type();
            if( !is_null( $db_recommendation_type ) )
            {
              if( 'Approved' == $db_recommendation_type->name )
              {
                foreach( $stage_type_list as $db_stage_type )
                {
                  if( 'Decision Made' == $db_stage_type->name )
                  {
                    $db_next_stage_type = $db_stage_type;
                    break;
                  }
                }
              }
              else
              {
                foreach( $stage_type_list as $db_stage_type )
                {
                  if( 'Second SMT Decision' == $db_stage_type->name )
                  {
                    $db_next_stage_type = $db_stage_type;
                    break;
                  }
                }
              }
            }
          }
        }
        else if( 'SMT Decision' == $db_current_stage_type->name )
        {
          $db_review = current( $db_stage->get_review_object_list() );
          if( $db_review )
          {
            $db_recommendation_type = $db_review->get_recommendation_type();
            if( !is_null( $db_recommendation_type ) )
            {
              if( 'Approved' == $db_recommendation_type->name || 'Not Approved' == $db_recommendation_type->name )
              {
                foreach( $stage_type_list as $db_stage_type )
                {
                  if( 'Decision Made' == $db_stage_type->name )
                  {
                    $db_next_stage_type = $db_stage_type;
                    break;
                  }
                }
              }
              else if( 'Revise' == $db_recommendation_type->name )
              {
                foreach( $stage_type_list as $db_stage_type )
                {
                  if( 'Revision Required' == $db_stage_type->name )
                  {
                    $db_next_stage_type = $db_stage_type;
                    break;
                  }
                }
              }
            }
          }
        }
        else if( 'Decision Made' == $db_current_stage_type->name )
        {
          // the decision for this reqn depends on one of several possible reviews
          $review_sel = lib::create( 'database\select' );
          $review_sel->add_table_column( 'review_type', 'name' );
          $review_sel->add_table_column( 'recommendation_type', 'name', 'recommendation' );
          $review_mod = lib::create( 'database\modifier' );
          $review_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
          $review_mod->join( 'recommendation_type', 'review.recommendation_type_id', 'recommendation_type.id' );
          $review_list = array();
          foreach( $this->get_review_list( $review_sel, $review_mod ) as $review )
            $review_list[$review['name']] = $review['recommendation'];

          $recommendation = NULL;
          // if there is a second SMT review then use that decision
          if( array_key_exists( 'Second SMT', $review_list ) ) $recommendation = $review_list['Second SMT'];
          // if there is a first SMT review then use that decision
          else if( array_key_exists( 'SMT', $review_list ) ) $recommendation = $review_list['SMT'];
          // if the chair approved their review then approve
          else if( array_key_exists( 'Chair', $review_list ) && 'Approved' == $review_list['Chair'] ) $recommendation = 'Approved';
          // if there is no chair review then do not approve (rejected before DSAC review)
          else if( !array_key_exists( 'Chair', $review_list ) ) $recommendation = 'Not Approved';

          if( !is_null( $recommendation ) )
          {
            foreach( $stage_type_list as $db_stage_type )
            {
              if( ( 'Approved' == $recommendation && 'Agreement' == $db_stage_type->name ) ||
                  ( 'Not Approved' == $recommendation && 'Not Approved' == $db_stage_type->name ) )
              {
                $db_next_stage_type = $db_stage_type;
                break;
              }
            }
          }
        }
      }
    }

    return $db_next_stage_type;
  }

  /**
   * Proceeds to the reqn to the next stage
   * 
   * The next stage is based on the current stage as well as the reqn's reviews
   * @access public
   */
  public function proceed_to_next_stage( $stage_type = NULL )
  {
    // check the primary key value
    if( is_null( $this->id ) )
    {
      log::warning( 'Tried to add stage to reqn with no primary key.' );
      return;
    }

    $review_class_name = lib::get_class_name( 'database\review' );
    $stage_type_class_name = lib::get_class_name( 'database\stage_type' );
    $db_user = lib::create( 'business\session' )->get_user();
    $db_current_stage = $this->get_current_stage();
    $db_current_stage_type = is_null( $db_current_stage ) ? NULL : $db_current_stage->get_stage_type();

    $db_next_stage_type = NULL;
    if( is_null( $stage_type ) )
    {
      $db_next_stage_type = $this->get_next_stage_type();
      if( is_null( $db_next_stage_type ) )
        throw lib::create( 'exception\runtime',
          'Unable to proceed to next stage since there is currently no valid stage type available.', __METHOD__ );
    }
    else if( is_object( $stage_type ) )
    {
      if( is_a( $stage_type, lib::get_class_name( 'database\stage_type' ) ) ) $db_next_stage_type = $stage_type;
    }
    else if( is_integer( $stage_type ) || ( is_string( $stage_type ) && util::string_matches_int( $stage_type ) ) )
    {
      $db_next_stage_type = $stage_type_class_name::get_unique_record( 'rank', $stage_type );
    }
    else if( is_string( $stage_type ) )
    {
      $db_next_stage_type = $stage_type_class_name::get_unique_record( 'name', $stage_type );
    }

    if( is_null( $db_next_stage_type ) )
      throw lib::create( 'exception\argument', 'stage_type', $stage_type, __METHOD__ );

    // Note: there is a special circumstanse where a reqn is being rejected during the DSAC selection stage (make note here)
    $reject_selection = !is_null( $db_current_stage_type ) &&
                        'DSAC Selection' == $db_current_stage_type->name &&
                        'Decision Made' == $db_next_stage_type->name;

    // make sure the stage type is appropriate
    if( is_null( $db_current_stage_type ) )
    {
      // we can only add the first stage when the reqn currently has no stages
      if( 1 != $db_next_stage_type->rank )
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" but reqn has no existing stage.', $db_next_stage_type->name ),
          __METHOD__ );
    }
    else
    {
      // make sure there the next stage comes after the current stage
      if( !$db_next_stage_type->comes_after( $db_current_stage_type ) )
        throw lib::create( 'exception\runtime',
          sprintf( 'Tried to add stage "%s" which does not come after current stage "%s".',
                   $db_next_stage_type->name,
                   $db_current_stage_type->name ),
          __METHOD__ );

      // determine whether we can safely proceed to the next stage (ignoring if the DSAC selection stage has been rejected)
      if( !$reject_selection )
      {
        $result = $db_current_stage->check_if_complete();
        if( true !== $result ) throw lib::create( 'exception\notice', $result, __METHOD__ );
      }
    }

    // save the user who completed the current stage
    if( !is_null( $db_current_stage ) )
    {
      $db_current_stage->user_id = $db_user->id;
      $db_current_stage->datetime = util::get_datetime_object();
      $db_current_stage->save();
    }

    // create the new stage
    $db_next_stage = lib::create( 'database\stage' );
    $db_next_stage->reqn_id = $this->id;
    $db_next_stage->stage_type_id = $db_next_stage_type->id;
    $db_next_stage->save();

    // if we have just entered the admin review stage then set the identifier
    if( 'Admin Review' == $db_next_stage_type->name )
    {
      $base = $this->get_deadline()->date->format( 'ym' );
      $this->identifier = $this->get_deadline()->get_next_identifier();
      $this->save();
    }
    // if we have just entered the active stage then create symbolic links to all data files and update file timestamps
    else if( 'Active' == $db_next_stage_type->name )
    {
      $this->refresh_study_data_files();
    }

    // manage any reviews associated with the current stage
    if( !is_null( $db_current_stage_type ) )
    {
      foreach( $db_current_stage_type->get_review_object_list( $this ) as $db_review )
      {
        if( $reject_selection )
        {
          // remove all reviews
          $db_review->delete();
        }
        else
        {
          // update the current stage's review's reviewer with the current user if it isn't already set
          if( is_null( $db_review->user_id ) )
          {
            $db_review->user_id = $db_user->id;
            $db_review->save();
          }
        }
      }
    }
  }

  /**
   * Generates a PDF form version of the reqn (overwritting the previous version)
   * 
   * @param string $type One of "application" or "checklist" which determines which form to generate
   * @access public
   */
  public function generate_pdf_form( $type )
  {
    $pdf_form_type_class_name = lib::get_class_name( 'database\pdf_form_type' );

    $db_pdf_form = NULL;
    $data = array( 'identifier' => $this->identifier );
    $filename = NULL;

    if( !is_null( $this->applicant_name ) ) $data['applicant_name'] = $this->applicant_name;
    if( !is_null( $this->title ) ) $data['title'] = $this->title;

    if( 'application' == $type )
    {
      // get the data application and filename
      $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Data Application' );
      $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
      $filename = sprintf( '%s/%s.pdf', DATA_APPLICATION_PATH, $this->id );

      if( !is_null( $this->applicant_position ) ) $data['applicant_position'] = $this->applicant_position;
      if( !is_null( $this->applicant_affiliation ) ) $data['applicant_affiliation'] = $this->applicant_affiliation;
      if( !is_null( $this->applicant_address ) ) $data['applicant_address'] = $this->applicant_address;
      if( !is_null( $this->applicant_phone ) ) $data['applicant_phone'] = $this->applicant_phone;
      if( !is_null( $this->applicant_email ) ) $data['applicant_email'] = $this->applicant_email;
      if( !is_null( $this->graduate_name ) ) $data['graduate_name'] = $this->graduate_name;
      if( !is_null( $this->graduate_program ) ) $data['graduate_program'] = $this->graduate_program;
      if( !is_null( $this->graduate_institution ) ) $data['graduate_institution'] = $this->graduate_institution;
      if( !is_null( $this->graduate_address ) ) $data['graduate_address'] = $this->graduate_address;
      if( !is_null( $this->graduate_phone ) ) $data['graduate_phone'] = $this->graduate_phone;
      if( !is_null( $this->graduate_email ) ) $data['graduate_email'] = $this->graduate_email;
      if( !is_null( $this->start_date ) ) $data['start_date'] = $this->start_date->format( 'Y-m-d' );
      if( !is_null( $this->duration ) ) $data['duration'] = $this->duration;
      if( !is_null( $this->keywords ) ) $data['keywords'] = $this->keywords;
      if( !is_null( $this->lay_summary ) ) $data['lay_summary'] = $this->lay_summary;
      $data['word_count'] = is_null( $this->lay_summary ) ? 0 : count( explode( ' ', $this->lay_summary ) );
      if( !is_null( $this->background ) ) $data['background'] = $this->background;
      if( !is_null( $this->objectives ) ) $data['objectives'] = $this->objectives;
      if( !is_null( $this->methodology ) ) $data['methodology'] = $this->methodology;
      if( !is_null( $this->analysis ) ) $data['analysis'] = $this->analysis;

      if( !is_null( $this->funding ) )
      {
        if( 'yes' == $this->funding ) $data['funding_yes'] = 'Yes';
        else if( 'no' == $this->funding ) $data['funding_no'] = 'Yes';
        else if( 'requested' == $this->funding ) $data['funding_requested'] = 'Yes';
      }
      if( !is_null( $this->funding_agency ) ) $data['funding_agency'] = $this->funding_agency;
      if( !is_null( $this->grant_number ) ) $data['grant_number'] = $this->grant_number;
      if( !is_null( $this->ethics ) ) $data['ethics'] = $this->ethics ? 'yes' : 'no';
      if( !is_null( $this->ethics_date ) ) $data['ethics_date'] = $this->ethics_date->format( 'Y-m-d' );
      if( !is_null( $this->waiver ) )
      {
        if( 'graduate' == $this->waiver ) $data['waiver_graduate'] = 'Yes';
        else if( 'postdoc' == $this->waiver ) $data['waiver_postdoc'] = 'Yes';
      }
      if( !is_null( $this->applicant_name ) ) $data['signature_applicant_name'] = $this->applicant_name;

      foreach( $this->get_coapplicant_list() as $index => $coapplicant )
      {
        $data[sprintf( 'coapplicant%d_name', $index+1 )] = $coapplicant['name'];
        $data[sprintf( 'coapplicant%d_position', $index+1 )] =
          sprintf( "%s\n%s\n%s", $coapplicant['position'], $coapplicant['affiliation'], $coapplicant['email'] );
        $data[sprintf( 'coapplicant%d_role', $index+1 )] = $coapplicant['role'];
        $data[sprintf( 'coapplicant%d_%s', $index+1, $coapplicant['access'] ? 'yes' : 'no' )] = 'Yes';
      }

      $reference_list = array();
      $reference_sel = lib::create( 'database\select' );
      $reference_sel->add_column( 'rank' );
      $reference_sel->add_column( 'reference' );
      $reference_mod = lib::create( 'database\modifier' );
      $reference_mod->order( 'rank' );
      foreach( $this->get_reference_list( $reference_sel, $reference_mod ) as $reference )
        $reference_list[] = sprintf( '%s.  %s', $reference['rank'], $reference['reference'] );
      $data['references'] = implode( "\n", $reference_list );
    }
    else if( 'checklist' == $type )
    {
      // get the data application and filename
      $db_pdf_form_type = $pdf_form_type_class_name::get_unique_record( 'name', 'Data Checklist' );
      $db_pdf_form = $db_pdf_form_type->get_active_pdf_form();
      $filename = sprintf( '%s/%s.pdf', DATA_CHECKLIST_PATH, $this->id );

      if( $this->comprehensive ) $data['comprehensive'] = 'Yes';
      if( $this->tracking ) $data['tracking'] = 'Yes';
      if( !is_null( $this->part2_a_comment ) ) $data['part2_a_comment'] = $this->part2_a_comment;
      if( !is_null( $this->part2_b_comment ) ) $data['part2_b_comment'] = $this->part2_b_comment;
      if( !is_null( $this->part2_c_comment ) ) $data['part2_c_comment'] = $this->part2_c_comment;
      if( !is_null( $this->part2_d_comment ) ) $data['part2_d_comment'] = $this->part2_d_comment;
      if( !is_null( $this->part2_e_comment ) ) $data['part2_e_comment'] = $this->part2_e_comment;
      if( !is_null( $this->part2_f_comment ) ) $data['part2_f_comment'] = $this->part2_f_comment;

      $reqn_data_option_list = array();
      $reqn_data_option_sel = lib::create( 'database\select' );
      $reqn_data_option_sel->add_column( 'data_option_id' );
      $reqn_data_option_sel->add_table_column( 'study_phase', 'code' );
      $reqn_data_option_mod = lib::create( 'database\modifier' );
      $reqn_data_option_mod->join( 'study_phase', 'reqn_data_option.study_phase_id', 'study_phase.id' );
      foreach( $this->get_reqn_data_option_list( $reqn_data_option_sel, $reqn_data_option_mod ) as $reqn_data_option )
        $data[sprintf( 'data_option_%s_%s', $reqn_data_option['data_option_id'], $reqn_data_option['code'] )] = 'Yes';
    }

    if( is_null( $db_pdf_form ) )
      throw lib::create( 'exception\runtime',
        'Cannot generate PDF form since there is no active Data Application PDF form.', __METHOD__ );

    $pdf_writer = lib::create( 'business\pdf_writer' );
    $pdf_writer->set_template( sprintf( '%s/%d.pdf', PDF_FORM_PATH, $db_pdf_form->id ) );
    $pdf_writer->fill_form( $data );
    if( !$pdf_writer->save( $filename ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate PDF form "%s" for requisition %s%s',
          $filename,
          $this->identifier,
          "\n".$pdf_writer->get_error()
        ),
        __METHOD__
      );
    }
  }

  /**
   * Generates a text file listing this reqn's reviews
   * 
   * @access public
   */
  public function generate_reviews_file()
  {
    $text = sprintf(
      "Requisition: %s\n".
      "Title: %s\n".
      "Applicant: %s\n".
      "Lay Summary:\n".
      "%s\n",
      $this->identifier,
      $this->title,
      $this->applicant_name,
      $this->lay_summary
    );

    $review_sel = lib::create( 'database\select' );
    $review_sel->add_table_column( 'user', 'first_name' );
    $review_sel->add_table_column( 'user', 'last_name' );
    $review_sel->add_column( 'date' );
    $review_sel->add_table_column( 'review_type', 'name', 'type' );
    $review_sel->add_table_column( 'recommendation_type', 'name', 'recommendation' );
    $review_sel->add_column( 'note' );

    $review_mod = lib::create( 'database\modifier' );
    $review_mod->left_join( 'user', 'review.user_id', 'user.id' );
    $review_mod->join( 'review_type', 'review.review_type_id', 'review_type.id' );
    $review_mod->join( 'recommendation_type', 'review.recommendation_type_id', 'recommendation_type.id' );
    $review_mod->order( 'date' );
    $review_mod->order( 'stage_type_id' );

    foreach( $this->get_review_list( $review_sel, $review_mod ) as $review )
    {
      $text .= sprintf(
        "\n\nType: %s\n".
        "Reviewer: %s\n".
        "Created On: %s\n".
        "Recommendation: %s\n".
        "Notes:\n".
        "%s\n",
        $review['type'],
        is_null( $review['first_name'] ) ? '(none)' : $review['first_name'].' '.$review['last_name'],
        $review['date'],
        is_null( $review['recommendation'] ) ? '(none)' : $review['recommendation'],
        is_null( $review['note'] ) ? '(none)' : $review['note']
      );
    }

    // convert for Windows
    $text = iconv( 'UTF-8', 'Windows-1252//TRANSLIT', str_replace( "\n", "\r\n", $text ) );

    $filename = sprintf( '%s/%s.txt', DATA_REVIEWS_PATH, $this->id );
    if( false === file_put_contents( $filename, $text, LOCK_EX ) )
    {
      throw lib::create( 'exception\runtime',
        sprintf(
          'Failed to generate reviews text file "%s" for requisition %s',
          $filename,
          $this->identifier
        ),
        __METHOD__
      );
    }
  }

  /**
   * Provides a new temporary identifier which doesn't already exist
   * 
   * @access public
   */
  public static function get_temporary_identifier()
  {
    $count = 0;
    $modifier = NULL;
    do
    {
      // guard against an infinite loop
      if( $count++ > 1000 ) throw lib::create( 'exception\runtime', 'Unable to create a new temporary identifier.', __METHOD__ );

      // pick a random number
      $identifier = 'T'.rand( 10000, 99999 );

      // see if it is already in use
      $modifier = lib::create( 'database\modifier' );
      $modifier->where( 'identifier', '=', $identifier );
    } while( static::count( $modifier ) );

    return $identifier;
  }

  /**
   * Returns the requisition's study-data paths
   * 
   * @param string $type One of "data" or "web"
   * @return string
   */
  public function get_study_data_path( $type )
  {
    if( !in_array( $type, array( 'data', 'web' ) ) ) throw lib::create( 'exception\argument', 'type', $type, __METHOD__ );
    return sprintf( '%s/%s/%s', STUDY_DATA_PATH, $type, $this->data_directory );
  }

  /**
   * Returns the number of days left before the reqn's study-data will expire
   * 
   * @return integer
   */
  public function get_study_data_expiry()
  {
    $util_class_name = lib::get_class_name( 'util' );
    $setting_manager = lib::create( 'business\setting_manager' );

    $data_path = $this->get_study_data_path( 'data' );

    // get any file in the reqn's data directory
    $list = glob( $data_path.'/*' );
    if( false === $list )
    {
      log::warning( sprintf( 'Unable to list contents of the data directory belonging to requisition "%s" (%s)',
        $this->identifier,
        $data_path
      ) );
      return 0;
    }

    $filename = NULL;
    foreach( $list as $file )
    {
      if( is_file( $file ) )
      {
        $filename = $file;
        break;
      }
    }

    if( is_null( $filename ) ) return 0;

    $timestamp = filemtime( $filename );
    if( false === $timestamp )
    {
      log::warning( sprintf( 'Unable to get modification time of data file belonging to requisition "%s" (%s)',
        $this->identifier,
        $filename
      ) );
      return 0;
    }

    $now = $util_class_name::get_datetime_object();
    $datetime_obj = $util_class_name::get_datetime_object();
    $datetime_obj->setTimestamp( $timestamp );
    $days = $setting_manager->get_setting( 'general', 'study_data_expiry' ) - $datetime_obj->diff( $now )->days;
    return 0 > $days ? 0 : $days;
  }

  /**
   * Refreshes links to all study data files, resets the file-removal countdown timer, and copies supplemental files
   */
  public function refresh_study_data_files()
  {
    $util_class_name = lib::get_class_name( 'util' );
    $supplemental_file_class_name = lib::get_class_name( 'database\supplemental_file' );
    $data_path = $this->get_study_data_path( 'data' );
    $web_path = $this->get_study_data_path( 'web' );

    // delete all existing links
    $util_class_name::exec_timeout( sprintf( 'rm -rf %s/*', $web_path ) );

    // refresh links
    $list = glob( $data_path.'/*' );
    if( false !== $list )
    {
      foreach( $list as $file )
      {
        if( is_file( $file ) )
        {
          // update the file's timestamp to reset the link removal counter
          touch( $file );

          // create a link if one doesn't already exist
          $filename = sprintf( '../../data/%s%s', $this->data_directory, str_replace( $data_path, '', $file ) );
          $link = str_replace( $data_path, $web_path, $file );

          // create a relative link to the data file
          $result = symlink( $filename, $link );
          if( !$result )
          {
            throw lib::create( 'exception\runtime', sprintf(
              'Unable to create link to "%s" named "%s".',
              $link,
              $filename
            ), __METHOD__ );
          }
        }
      }
    }

    // add the instructions
    $filename = $this->get_filename( 'instruction' );
    if( is_file( $filename ) )
    {
      $link = sprintf( '%s/%s', $web_path, $this->instruction_filename );
      $result = symlink( $filename, $link );
      if( !$result )
      {
        throw lib::create( 'exception\runtime', sprintf(
          'Unable to create link to "%s" named "%s".',
          $link,
          $filename
        ), __METHOD__ );
      }
    }

    // add all supplemental files
    $lang = $this->get_language()->code;
    foreach( $supplemental_file_class_name::select_objects() as $db_supplemental_file )
    {
      $name = sprintf( 'name_%s', $lang );
      $filename = $db_supplemental_file->get_filename( $lang );
      $link = sprintf( '%s/%s', $web_path, $db_supplemental_file->$name );

      if( is_file( $filename ) )
      {
        $result = symlink( $filename, $link );
        if( !$result )
        {
          throw lib::create( 'exception\runtime', sprintf(
            'Unable to create link to "%s" named "%s".',
            $link,
            $filename
          ), __METHOD__ );
        }
      }
    }
  }

  /**
   * Creates a unique directory for study data and returns the directory name
   * 
   * @access public
   * @return string
   */
  public static function generate_data_directory()
  {
    $count = 0;
    while( 100 > $count++ )
    {
      $name = sprintf(
        '%s-%s-%s-%s',
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) )
      );

      // create the data directory
      $path = sprintf( '%s/data/%s', STUDY_DATA_PATH, $name );
      if( !file_exists( $path ) )
      {
        if( !mkdir( $path ) )
          throw lib::create( 'exception\runtime', sprintf( 'Unable to create data directory "%s"', $path ), __METHOD__ );
        return $name;
      }

      // create the web directory
      $path = sprintf( '%s/web/%s', STUDY_DATA_PATH, $name );
      if( !file_exists( $path ) )
      {
        if( !mkdir( $path ) )
          throw lib::create( 'exception\runtime', sprintf( 'Unable to create data directory "%s"', $path ), __METHOD__ );
        return $name;
      }
    }

    // if we get here then something is wrong
    throw lib::create( 'exception\runtime', 'Unable to create unique data directory.', __METHOD__ );
  }
}
